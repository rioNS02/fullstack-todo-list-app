const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendError = require("../helper/sendError");

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];

  try {
    if (!authorization) {
      return sendError(res, "Anauthorization", 401);
    }

    const verified = await jwt.verify(token, process.env.SECRET_KEY);

    req.user = verified;
    next();
  } catch (error) {
    return sendError(res, error, 500);
  }
};

module.exports = authMiddleware;
