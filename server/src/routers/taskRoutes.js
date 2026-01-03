const express = require("express");
const router = express.Router();
const {
  getAllTask,
  addTask,
  deleteTask,
  updateTask,
  getTaskByUser,
  updateStatusTask,
} = require("../controller/taskController");
const { authAccess } = require("../middleware/authMiddleware");

router.get("/api/v1/tasks", getAllTask);

router.get("/api/v1/tasks/me", authAccess, getTaskByUser);

router.post("/api/v1/tasks", authAccess, addTask);

router.delete("/api/v1/tasks/:id", authAccess, deleteTask);

router.patch("/api/v1/tasks/:id", authAccess, updateTask);

router.patch("/api/v1/tasks/:id/status", authAccess, updateStatusTask);

module.exports = router;
