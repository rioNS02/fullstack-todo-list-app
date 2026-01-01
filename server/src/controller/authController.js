const database = require("../service/database");
const bcrypt = require("bcrypt");
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

module.exports = {
  register,
};
