// models/tasks.js
let tasks = [
  {
    id: 1,
    title: "Изучить Express",
    description: "Прочитать документацию",
    completed: false,
    projectId: 1,
    tags: ["учеба", "js"],
  },
  {
    id: 2,
    title: "Купить продукты",
    description: "Молоко, хлеб, яйца",
    completed: true,
    projectId: 2,
    tags: ["дом"],
  },
];

const getAll = () => tasks;

const getById = (id) => tasks.find((task) => task.id === id);

const create = (newTask) => {
  const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
  const task = {
    id: maxId + 1,
    ...newTask,
    completed: newTask.completed || false,
  };
  tasks.push(task);
  return task;
};

const update = (id, updatedData) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return null;
  tasks[index] = { id, ...updatedData };
  return tasks[index];
};

const remove = (id) => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
};

module.exports = { getAll, getById, create, update, remove };
