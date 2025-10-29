const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/authController");

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
module.exports = router;
