const database = require("../service/database");
const sendSuccess = require("../helper/sendSuccess");
const sendError = require("../helper/sendError");

// READ ALL DATA TASK
const getAllTask = async (req, res) => {
  const sql = "SELECT * FROM tasks";

  try {
    const [rows] = await database.execute(sql);
    return sendSuccess(res, rows, 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// GET data Task from userID
const getTaskByUser = async (req, res) => {
  const { userID } = req.params;
  const sql = "SELECT * FROM tasks WHERE userID = ?";

  try {
    const [rows] = await database.execute(sql, [userID]);
    // cek ada data userID
    if (rows.length === 0) {
      return sendError(res, "task not found", 404);
    }
    sendSuccess(res, rows, 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// CREATE DATA TASK
const addTask = async (req, res) => {
  try {
    const sql = `INSERT INTO tasks (title, description, status, date_due, userID) VALUES (?,?,?,?,?)`;
    const { title, description, status, date_due, userID } = req.body;

    const [result] = await database.execute(sql, [
      title,
      description,
      status,
      date_due,
      userID,
    ]);

    // Cek apakah ada data user yang bisa menambahkan task
    if (!userID) {
      return sendError(res, "User not found", 404);
    }

    return sendSuccess(res, "Add task successfull", 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// DELETE DATA TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.body;
    const sql = "DELETE FROM tasks WHERE taskID = ? AND userID = ?";

    const [result] = await database.execute(sql, [id, userID]);

    if (result.affectedRows === 0) {
      return sendError(res, "Task not found", 404);
    }

    return sendSuccess(res, "Delete task succsessfull", 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, date_due, userID } = req.body;
    const sql =
      "UPDATE tasks SET title = ?, description = ?, status = ?, date_due = ? WHERE taskID = ? AND userID = ?";

    const [result] = await database.execute(sql, [
      title,
      description,
      status,
      date_due,
      id,
      userID,
    ]);

    if (result.affectedRows === 0) {
      return sendError(res, "Task not found", 404);
    }

    return sendSuccess(res, "Update task successfull", 201);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = {
  getAllTask,
  getTaskByUser,
  addTask,
  deleteTask,
  updateTask,
};
