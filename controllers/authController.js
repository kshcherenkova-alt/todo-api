const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email и пароль обязательны",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Пароль должен содержать минимум 6 символов",
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: "Пользователь с таким email уже существует",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, passwordHash });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email и пароль обязательны",
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: "Неверный email или пароль",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    res.status(200).json({
      message: "Вход выполнен успешно",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
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

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        error: "Старый и новый пароль обязательны",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Новый пароль должен содержать минимум 6 символов",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(400).json({
        error: "Новый пароль должен отличаться от старого",
      });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "Пользователь не найден",
      });
    }

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        error: "Неверный старый пароль",
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await user.update({ passwordHash: newHash });

    res.status(200).json({
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
};
