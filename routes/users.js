const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../model/database");
const { authenticateToken } = require("../middleware/auth");

// Create an account and generate an API key
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const user = {
      name,
      email,
      password: hashedPassword,
      apiKey: jwt.sign({ email }, process.env.JWT_SECRET),
    };

    db.users.insert(user, (err, newUser) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(newUser);
    });
  });
});

// Log in and get API key
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.users.findOne({ email }, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (!result) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const apiKey = user.apiKey;
      res.json({ apiKey });
    });
  });
});

// Get the user's name and email using their API key
router.get("/user", authenticateToken, (req, res) => {
  const { name, email } = req.user;
  res.json({ name, email });
});

module.exports = router;
