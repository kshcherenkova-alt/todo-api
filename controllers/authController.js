const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({
        error: "Email и пароль обязательны",
      });
    }

    // 2. Проверка длины пароля
    if (password.length < 6) {
      return res.status(400).json({
        error: "Пароль должен содержать минимум 6 символов",
      });
    }

    // 3. Проверка уникальности email
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: "Пользователь с таким email уже существует",
      });
    }

    // 4. Хеширование пароля (10 раундов соли)
    const passwordHash = await bcrypt.hash(password, 10);

    // 5. Создание пользователя в БД
    const user = await User.create({ email, passwordHash });

    // 6. Ответ (passwordHash скрыт через toJSON)
    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ВХОД — POST /auth/login
// ============================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({
        error: "Email и пароль обязательны",
      });
    }

    // 2. Поиск пользователя по email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    // 3. Проверка пароля
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    // 4. Генерация JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    // 5. Ответ с токеном
    res.status(200).json({
      message: "Вход выполнен успешно",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ПРОФИЛЬ — GET /auth/profile (защищённый)
// ============================================
const getProfile = async (req, res, next) => {
  try {
    // req.user добавляется middleware после проверки токена
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "Пользователь не найден",
      });
    }

    res.status(200).json(user.toJSON());
  } catch (error) {
    next(error);
  }
};

// ============================================
// СМЕНА ПАРОЛЯ — POST /auth/change-password (защищённый)
// Дополнительный механизм безопасности
// ============================================
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Проверка обязательных полей
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: "Старый и новый пароль обязательны",
      });
    }

    // 2. Проверка длины нового пароля
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Новый пароль должен содержать минимум 6 символов",
      });
    }

    // 3. Проверка, что новый пароль отличается от старого
    if (oldPassword === newPassword) {
      return res.status(400).json({
        error: "Новый пароль должен отличаться от старого",
      });
    }

    // 4. Поиск пользователя
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "Пользователь не найден",
      });
    }

    // 5. Проверка старого пароля
    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: "Неверный старый пароль",
      });
    }

    // 6. Хеширование нового пароля
    const newHash = await bcrypt.hash(newPassword, 10);

    // 7. Обновление пароля в БД
    await user.update({ passwordHash: newHash });

    // 8. Ответ
    res.status(200).json({
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// ЭКСПОРТ
// ============================================
module.exports = {
  register,
  login,
  getProfile,
  changePassword,
};
