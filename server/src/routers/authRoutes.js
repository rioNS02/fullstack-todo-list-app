const express = require("express");
const router = express.Router();
const { register, login, refresh } = require("../controller/authController");

router.post("/api/auth/register", register);
router.post("/api/auth/login", login);
router.post("/api/auth/refresh", refresh);
module.exports = router;
