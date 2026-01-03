const express = require("express");
const {
  getAllUser,
  updateUser,
  getUser,
  deleteUser,
} = require("../controller/userController");
const { authAccess } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/v1/users", getAllUser);
router.get("/api/v1/users/me", authAccess, getUser);
router.put("/api/v1/user/:id", updateUser);
router.delete("/api/v1/user/:id", deleteUser);

module.exports = router;
