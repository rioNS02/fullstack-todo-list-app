const sendSuccess = (res, dataOrMessage, status = 200) => {
  if (typeof dataOrMessage === "string") {
    return res.status(status).json(dataOrMessage);
  }
  return res.status(status).json({ message: "success", data: dataOrMessage });
};

module.exports = sendSuccess;
