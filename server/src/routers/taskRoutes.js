const express = require("express");
const router = express.Router();
const {
  getAllTask,
  addTask,
  deleteTask,
  updateTask,
  getTaskByUser,
} = require("../controller/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/api/v1/tasks", getAllTask);

router.get("/api/v1/tasks/me", authMiddleware, getTaskByUser);

router.post("/api/v1/tasks", authMiddleware, addTask);

router.delete("/api/v1/tasks/:id", authMiddleware, deleteTask);

router.put("/api/v1/tasks/:id", authMiddleware, updateTask);

module.exports = router;
