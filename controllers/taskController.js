const { Op } = require("sequelize");
const { Task } = require("../models");

const getTasks = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = search ? { title: { [Op.iLike]: `%${search}%` } } : {};
    const tasks = await Task.findAll({ where, order: [["id", "ASC"]] });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, projectId, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }
    const newTask = await Task.create({
      title,
      description,
      completed,
      projectId,
      priority,
    });
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    if (!req.body.title) {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }
    await task.update(req.body);
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
