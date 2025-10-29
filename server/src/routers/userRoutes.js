const express = require("express");
const {
  getAllUser,
  updateUser,
  getUser,
  deleteUser,
} = require("../controller/userController");

const router = express.Router();

router.get("/api/v1/user", getAllUser);
router.get("/api/v1/user/:id", getUser);
router.put("/api/v1/user/:id", updateUser);
router.delete("/api/v1/user/:id", deleteUser);

module.exports = router;
