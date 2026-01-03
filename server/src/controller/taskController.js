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
  const userID = req.user.userID;

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
  const userID = req.user.userID;
  const { title, description, date_due } = req.body;
  const sql = `INSERT INTO tasks (userID, title, description, date_due) 
                VALUES (?, ?, ?, ?)`;
  try {
    const [result] = await database.execute(sql, [
      userID,
      title,
      description,
      date_due,
    ]);

    return sendSuccess(res, "Add task successfull", 200);
  } catch (error) {
    return sendError(res, error, 500);
  }
};

// DELETE DATA TASK
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userID = req.user.userID;
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
    const userID = req.user.userID;
    const { id } = req.params;
    const { title, description, date_due } = req.body;
    const sql =
      "UPDATE tasks SET title = ?, description = ?, date_due = ? WHERE taskID = ? AND userID = ?";

    const [result] = await database.execute(sql, [
      title,
      description,
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

/* Updata status enum task */
const updateStatusTask = async (req, res) => {
  const userID = req.user.userID;
  const { id } = req.params;
  const { status } = req.body;

  const statusAllowed = ["pending", "on_progress", "done"];

  // Check input status user
  if (!statusAllowed.includes(status)) {
    return res.status(404).json({ message: "Please input status allowed" });
  }

  try {
    // Update status
    const updateStatusSql =
      "UPDATE tasks SET status = ? WHERE taskID = ? AND userID = ?";
    const [existing] = await database.execute(updateStatusSql, [
      status,
      id,
      userID,
    ]);

    // Check data task found
    if (existing.affectedRows === 0) {
      return sendError(res, "Task not found", 404);
    }

    return sendSuccess(res, "update status successfull", 200);
  } catch (error) {
    sendError(res, error, 500);
  }
};

module.exports = {
  getAllTask,
  getTaskByUser,
  addTask,
  deleteTask,
  updateTask,
  updateStatusTask,
};
