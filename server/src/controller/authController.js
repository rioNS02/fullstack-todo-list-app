const database = require("../service/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendError = require("../helper/sendError");
const sendSuccess = require("../helper/sendSuccess");

dotenv.config();

const register = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;

  try {
    // Check user already register
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await database.execute(sql, [email]);
    if (rows > 0) {
      return sendError(res, "User already exist", 400);
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Store user data
    const postUserSql =
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ?, ?)";
    const postUser = await database.execute(postUserSql, [
      firstname,
      lastname,
      username,
      email,
      hashPassword,
    ]);

    return sendSuccess(res, "Register successfull");
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// Login Auth --
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
  } catch (error) {
    sendError(res, error, 500);
  }
  // Check user found or not
  const sqlEmail = "SELECT * from users WHERE email = ?";
  const [rows] = await database.execute(sqlEmail, [email]);
  const user = rows[0];
  if (!user) {
    sendError(res, "User not found, ", 404);
  }

  // Check password
  const checKPassword = await bcrypt.compare(password, user.password);
  if (!checKPassword) {
    return sendError(res, "Incorrect password", 400);
  }

  // Create jwt token
  const payload = {
    userID: user.userID,
    email: user.email,
  };

  // create access token
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  // create refresh token
  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // cookies
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    nameSite: "none",
  });
  res.status(200).json({ message: "login success", accessToken, refreshToken });
};

module.exports = {
  register,
  login,
};
