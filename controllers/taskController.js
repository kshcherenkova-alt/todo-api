// controllers/taskController.js
const TaskModel = require("../models/tasks");

const getTasks = (req, res, next) => {
  try {
    let tasks = TaskModel.getAll();
    const { projectId, tag } = req.query;

    if (projectId) {
      const pid = parseInt(projectId);
      tasks = tasks.filter((task) => task.projectId === pid);
    }
    if (tag) {
      tasks = tasks.filter((task) => task.tags && task.tags.includes(tag));
    }

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const getTaskById = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const task = TaskModel.getById(id);
    if (!task) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

const createTask = (req, res, next) => {
  try {
    const { title, description, completed, projectId, tags } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }
    const newTask = TaskModel.create({
      title,
      description,
      completed,
      projectId,
      tags,
    });
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

const updateTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, completed, projectId, tags } = req.body;
    const existing = TaskModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    if (!title) {
      return res.status(400).json({ error: 'Поле "title" обязательно' });
    }
    const updated = TaskModel.update(id, {
      title,
      description,
      completed,
      projectId,
      tags,
    });
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteTask = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const deleted = TaskModel.remove(id);
    if (!deleted) {
      return res.status(404).json({ error: "Задача не найдена" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
