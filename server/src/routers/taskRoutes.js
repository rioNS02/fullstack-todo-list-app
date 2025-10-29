const express = require("express");
const router = express.Router();
const {
  getAllTask,
  addTask,
  deleteTask,
  updateTask,
  getTaskByUser,
} = require("../controller/taskController");

router.get("/api/v1/tasks", getAllTask);

router.get("/api/v1/tasks/:userID", getTaskByUser);

router.post("/api/v1/tasks", addTask);

router.delete("/api/v1/tasks/:id", deleteTask);

router.put("/api/v1/tasks/:id", updateTask);

module.exports = router;
