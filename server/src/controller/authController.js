const database = require("../service/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendError = require("../helper/sendError");
const sendSuccess = require("../helper/sendSuccess");

const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;
    // hash password
    const hashPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ? ,?)";

    // cek username ada di data apa belum?
    const [checkUsername] = await database.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // cek email ada di data apa tidak
    const [existing] = await database.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    switch (true) {
      case checkUsername.length > 0:
        return sendError(res, "Username already exists", 400);
      // check baris array ada email yang sudah terdaftar.
      case existing.length > 0:
        return sendError(res, "Email already exists", 400);
      default:
        // Simpan data ke database
        const [result] = await database.execute(sql, [
          firstname,
          lastname,
          username,
          email,
          hashPassword,
        ]);

        return sendSuccess(res, "Register Successfull", 200);
    }
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// Login Auth --
const login = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  const sqlEmail = "SELECT email from users WHERE email = ?";

  try {
    const [rows] = await database.execute(sqlEmail, [email]);

    // data email ada di tabel user?
    if (!rows.length) {
      return sendError(res, "Email not found", 404);
    }

    const user = rows[0];

    // Cek password ada di tabel user?
    const checKPassword = await bcrypt.compare(password, hashPassword);
    if (!checKPassword) {
      return sendError(res, "Incorrect password", 400);
    }
    const token = await jwt.sign(
      { email: user.email, password: user.password },
      process.env.SECRET_KEY
    );

    res.status(200).json({ Message: "Login succsessfull", token });
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = {
  register,
  login,
};
