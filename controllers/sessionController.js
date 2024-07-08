const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Fonction pour vérifier si l'utilisateur a les droits nécessaires
function hasAdminRights(user) {
  return user.Id_type_user_rights === 1;
}

exports.login = async (req, res) => {
  const { username, password_user } = req.body;

  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const [users] = await db.execute(query, [username]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    bcrypt.compare(password_user, user.password_user, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (result) {
        if (user.Id_type_user_rights !== 1) {
          return res.status(403).json({ message: "Access denied" });
        }

        const token = jwt.sign({ id: user.Id_user }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(200).json({
          status: "ok",
          message: "User logged in successfully",
          token: token,
          userId: user.Id_user,
          username: user.username, // Ajoutez le nom d'utilisateur à la réponse
        });
      } else {
        return res.status(401).json({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
};
// exports.login = async (req, res) => {
//   const { username, password_user } = req.body;

//   console.log(`Login attempt for username: ${username}`); // Ajout pour débogage

//   try {
//     const query = `SELECT * FROM users WHERE username = ?`;
//     const [users] = await db.execute(query, [username]);

//     if (users.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = users[0];

//     const passwordMatch = await bcrypt.compare(
//       password_user,
//       user.password_user
//     );
//     if (passwordMatch) {
//       if (!hasAdminRights(user)) {
//         return res.status(403).json({ message: "Access denied" });
//       }

//       const token = jwt.sign(
//         { id: user.Id_user, username: user.username },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: "1h",
//         }
//       );

//       return res.status(200).json({
//         status: "ok",
//         message: "User logged in successfully",
//         token: token,
//         userId: user.Id_user,
//         username: user.username,
//       });
//     } else {
//       return res.status(401).json({ message: "Password is incorrect" });
//     }
//   } catch (error) {
//     console.error("Error in login:", error);
//     return res
//       .status(500)
//       .json({ message: "Error logging in", error: error.message });
//   }
// };

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error in logout:", err);
      return res
        .status(500)
        .json({ message: "Error logging out", error: err.message });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "User logged out successfully" });
  });
};

exports.checkStatus = (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    return res.status(401).json({ loggedIn: false });
  }
};
