"use strict";

const { USER_TABLE, UserSchema } = require("./../models/user.model");
const { NOTE_TABLE, NoteSchema } = require("./../models/note.model");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(NOTE_TABLE, NoteSchema);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.drop(USER_TABLE);
    await queryInterface.drop(NOTE_TABLE);
  },
};
