const sendError = require("../helper/sendError");
const sendSuccess = require("../helper/sendSuccess");
const database = require("../service/database");

const getAllUser = async (req, res) => {
  try {
    const sql = "SELECT * FROM users";

    const [rows] = await database.execute(sql);

    return sendSuccess(res, rows, 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// Get user by id
const getUser = async (req, res) => {
  const userID = req.user.userID;

  const sql = "SELECT * FROM users WHERE userID = ?";

  try {
    const [rows] = await database.execute(sql, [userID]);

    // Cek jika tidak ada data
    if (rows.length === 0) {
      return sendError(res, "Data not found", 404);
    }
    return sendSuccess(res, rows, 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, username, email } = req.body;
  const sql =
    "UPDATE users SET first_name = ?, last_name = ?,username = ?, email = ? WHERE userID = ?";

  try {
    const [result] = await database.execute(sql, [
      firstname,
      lastname,
      username,
      email,
      id,
    ]);

    if (result.affectedRows === 0) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, "Update user successfull", 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE userID = ?";

  try {
    const [result] = await database.execute(sql, [id]);

    // Cek ada data user tidak
    if (result.affectedRows === 0) {
      return sendError(res, "Data not found", 404);
    }
    return sendSuccess(res, "Delete user success", 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = { getAllUser, getUser, updateUser, deleteUser };
