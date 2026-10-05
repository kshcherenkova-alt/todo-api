const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // 1. Получаем заголовок Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Токен не предоставлен" });
    }

    // 2. Проверяем формат: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Неверный формат токена" });
    }

    const token = parts[1];

    // 3. Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Прикрепляем пользователя к запросу
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
