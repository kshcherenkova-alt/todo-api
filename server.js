require("dotenv").config();

const express = require("express");
const app = express();
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/auth");

app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Внутренняя ошибка сервера" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
