// routes/userRoutes.js
const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email_user
 *               - password_user
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's name
 *               email_user:
 *                 type: string
 *                 description: The user's email
 *               password_user:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: Error in registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred on the server"
 */

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/profil", userController.getUserProfil);
router.put("/update/:id", userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

// Add this route to get user statistics
router.get("/statistics", userController.getUserStatistics);
router.get("/plant_counts", userController.getUserPlantCounts);
router.get("/trade_requests", userController.getUserTradeRequests);
module.exports = router;

router.delete("/admin/delete/:id", userController.adminDeleteUser);
