"use strict";

const {
  CATEGORY_TABLE,
  CategorySchema,
} = require("./../models/category.model");
const {
  NOTE_CATEGORY_TABLE,
  NoteCategorySchema,
} = require("./../models/note-category.model");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CATEGORY_TABLE, CategorySchema);
    await queryInterface.createTable(NOTE_CATEGORY_TABLE, NoteCategorySchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.drop(CATEGORY_TABLE);
    await queryInterface.drop(NOTE_CATEGORY_TABLE);
  },
};
