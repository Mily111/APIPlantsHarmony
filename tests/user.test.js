const db = require("../config/db");
const request = require("supertest");
const app = require("../server"); // Assurez-vous que ce chemin est correct
jest.mock("../config/db"); // S'assurer que le module DB est bien moqué

db.execute.mockImplementation(async (query, values) => {
  if (
    query.includes("SELECT * FROM users WHERE username = ? OR email_user = ?")
  ) {
    // S'assurer qu'aucun utilisateur n'existe pour permettre l'inscription
    if (values.includes("testuser") && values.includes("test@example.com")) {
      return [[]];
    }
    // Simuler l'existence pour le test de 409
    return [[{ id: 1, username: "testuser", email_user: "test@example.com" }]];
  }
  if (query.includes("INSERT INTO users")) {
    return [{ insertId: 1 }];
  }
});

describe("POST /api/users/register", () => {
  beforeEach(async () => {
    await global.resetTestData(); // Nettoie la base de données ou réinitialise l'état avant chaque test.

    jest.resetAllMocks(); // Réinitialise tous les mocks à leur état d'origine.

    // Réimplémentation du mock db.execute pour couvrir les cas d'utilisation de base
    db.execute.mockImplementation(async (query, values) => {
      // Simulation de la vérification de l'existence de l'utilisateur
      if (
        query.includes(
          "SELECT * FROM users WHERE username = ? OR email_user = ?"
        )
      ) {
        // Suppose que le nom d'utilisateur ou l'email "existingUser" ou "existing@example.com" doit retourner un utilisateur existant
        if (
          values.includes("existingUser") ||
          values.includes("existing@example.com")
        ) {
          return [
            [
              {
                id: 1,
                username: "existingUser",
                email_user: "existing@example.com",
              },
            ],
          ]; // Simule un utilisateur existant
        } else {
          return [[]]; // Aucun utilisateur existant
        }
      }
      // Simulation de l'insertion d'un nouvel utilisateur
      if (query.includes("INSERT INTO users")) {
        return [{ insertId: 123 }]; // Simule un succès d'insertion avec un ID utilisateur retourné
      }

      // Ajoute d'autres implémentations de mock pour d'autres requêtes si nécessaire
      throw new Error("Query not mocked: " + query);
    });
  });
  //   beforeEach(async () => {
  //     await global.resetTestData(); // Nettoyer avant chaque test
  //   });

  afterEach(async () => {
    await global.clearTestData(); // Nettoyer après chaque test
  });

  it("should register a new user successfully", async () => {
    const userData = {
      username: "newUser",
      email_user: "newuser@example.com",
      password_user: "securePassword123",
    };
    const response = await request(app)
      .post("/api/users/register")
      .send(userData);
    expect(response.status).toBe(201); // Assure-toi que l'API doit retourner 201 pour succès
    expect(response.body).toHaveProperty(
      "message",
      "User registered successfully"
    );
  });

  //   tests manipulation erreurs servers
  // Vous devrez mocker votre module de base de données ou le controller pour forcer une erreur serveur.
  it("should return a 500 error for server issues", async () => {
    // Simuler une erreur de serveur pour ce test spécifique
    db.execute.mockImplementationOnce(async () => {
      throw new Error("Database error");
    });
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      email_user: "test@example.com",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty("message", "Internal server error");
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      email_user: "test@example.com",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
  });

  // tests pour les champs manquant
  it("should return a 400 error if username is missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      email_user: "test@example.com",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Missing required fields");
  });

  it("should return a 400 error if email_user is missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Missing required fields");
  });

  it("should return a 400 error if password_user is missing", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      email_user: "test@example.com",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Missing required fields");
  });

  // tests pour les données valides
  it("should return a 400 error if email_user is invalid", async () => {
    const res = await request(app).post("/api/users/register").send({
      username: "testuser",
      email_user: "not-an-email",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Invalid email format");
  });

  // tests pour les utilisateurs dupliqués
  it("should return a 409 error if username is already taken", async () => {
    // Configurer le mock pour retourner un utilisateur existant uniquement pour ce test
    db.execute.mockImplementationOnce(async (query, values) => {
      if (
        query.includes(
          "SELECT * FROM users WHERE username = ? OR email_user = ?"
        )
      ) {
        return [
          [{ id: 1, username: "testuser", email_user: "test@example.com" }],
        ]; // Simuler un utilisateur existant
      }
    });

    const res = await request(app).post("/api/users/register").send({
      username: "testuser", // Supposé déjà existant
      email_user: "test2@example.com",
      password_user: "password123",
    });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty(
      "message",
      "Username or email already exists"
    );
  });

  afterAll(async () => {
    // Assure-toi que la fonction db.end() ou équivalente existe et est la bonne pour fermer ton pool de connexions.
    await db.pool.end(); // Cette fonction doit correspondre à celle de ton client de base de données pour fermer le pool de connexions.
  });
});
