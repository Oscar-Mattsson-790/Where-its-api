const db = require("../model/database");

// Middleware function to authenticate API key
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    res.status(401).json({ error: "API key missing" });
    return;
  }

  db.users.findOne({ apiKey }, (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!user) {
      res.status(401).json({ error: "Invalid API key" });
      return;
    }

    req.user = user;
    next();
  });
};

module.exports = {
  authenticateApiKey,
};
