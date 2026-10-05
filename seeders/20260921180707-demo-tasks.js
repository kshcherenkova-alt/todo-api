"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tasks", [
      {
        title: "Изучить Sequelize",
        description: "Прочитать документацию",
        completed: false,
        projectId: 1,
        priority: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Купить продукты",
        description: "Молоко, хлеб, яйца",
        completed: true,
        projectId: 2,
        priority: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Сделать зарядку",
        description: "Утренняя разминка",
        completed: false,
        projectId: 1,
        priority: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tasks", null, {});
  },
};
