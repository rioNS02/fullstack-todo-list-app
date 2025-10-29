const sendError = (res, messageError, status = 500) => {
  if (typeof messageError === "string") {
    return res.status(status).json({ message: messageError });
  }
  return res.status(status).json({ message: messageError?.message });
};

module.exports = sendError;
