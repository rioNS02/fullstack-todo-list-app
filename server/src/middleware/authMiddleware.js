const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendError = require("../helper/sendError");

dotenv.config();

const authAccess = async (req, res, next) => {
  const authorization = req.headers.authorization;

  const token = authorization.split(" ")[1];

  try {
    if (!authorization) {
      return sendError(res, "Anauthorization", 401);
    }

    const verified = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = verified;
    next();
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = { authAccess };
