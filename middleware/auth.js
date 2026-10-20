const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Неверный формат токена" });
    }

    const token = parts[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Токен истёк" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Неверный токен" });
    }
    return res.status(401).json({ error: "Ошибка аутентификации" });
  }
};

module.exports = authMiddleware;
