const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const db = require("../model/database");

const createUser = async (email, password) => {
  try {
    const user = await db.users.findOne({ email });
    if (user) {
      throw new Error("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuid.v4();
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
    };
    const createdUser = await db.users.insert(newUser);
    return createdUser;
  } catch (err) {
    throw err;
  }
};

const authenticateUser = async (email, password) => {
  try {
    const user = await db.users.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    return token;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createUser,
  authenticateUser,
};
