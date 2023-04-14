const db = require("../model/database");

// Create a new user account
const createUser = (email, password, callback) => {
  db.users.findOne({ email }, (err, user) => {
    if (err) {
      callback(err);
      return;
    }

    if (user) {
      callback(new Error("Email already in use"));
      return;
    }

    const apiKey = Math.floor(Math.random() * 1000000);

    const newUser = {
      email,
      password,
      apiKey,
    };

    db.users.insert(newUser, (err, createdUser) => {
      if (err) {
        callback(err);
        return;
      }

      callback(null, createdUser);
    });
  });
};

// Authenticate a user with email and password
const authenticateUser = (email, password, callback) => {
  db.users.findOne({ email, password }, (err, user) => {
    if (err) {
      callback(err);
      return;
    }

    if (!user) {
      callback(new Error("Invalid email or password"));
      return;
    }

    callback(null, user);
  });
};

module.exports = {
  createUser,
  authenticateUser,
};
