const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("../src/routers/authRoutes");
const userRoutes = require("../src/routers/userRoutes");
const taskRoutes = require("../src/routers/taskRoutes");

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

app.use(express.json());

app.use("/", authRoutes);

app.use("/", userRoutes);

app.use("/", taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running in port`, PORT);
});
