require("dotenv").config();
const express = require("express");

const app = express();
const SECRET_KEY = process.env.SECRET_KEY;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// We are using a mock authentication mechanism here with a hardcoded username and password.
// This is only for demonstration purposes and to prevent unauthorized users from acquiring a token.
// In a real-world scenario, proper authentication should be implemented based on actual user or device credentials.
// If the API is not exposed to external users (e.g., behind a VPN), you could potentially skip authentication.
const authEnpdpoint = "https://auth.appcircle.io/auth/v1/in-app-update/token";
app.post("/login", async (req, res) => {
  const { email, password, profileId } = req.body;

  /*
  // This is a mock authentication for demonstration purposes only.
  // In a real-world application, you should implement proper user authentication.
  // The current implementation uses hardcoded credentials, which is not secure.
  */
  if (email === "user@example.com" && password === "password123") {
    try {
      const response = await fetch(authEnpdpoint, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          profileId: profileId,
          // Get the secret from the environment variable based on the profileId
          secret: SECRET_KEY,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to authenticate" });
    }
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Development-only route for testing
if (process.env.NODE_ENV === "development") {
  app.get("/dev-test", (req, res) => {
    res.json({
      message: "This is a development-only route",
      environment: process.env.NODE_ENV,
      secretKeyLength: SECRET_KEY ? SECRET_KEY.length : "Not set",
    });
  });

  console.log("Development routes enabled");
}
