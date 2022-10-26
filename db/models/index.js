const { User, UserSchema } = require("./user.model");
const { Note, NoteSchema } = require("./note.model");
const { Category, CategorySchema } = require("./category.model");
const { NoteCategory, NoteCategorySchema } = require("./note-category.model");

function models(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Note.init(NoteSchema, Note.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  NoteCategory.init(NoteCategorySchema, NoteCategory.config(sequelize));
  User.associate(sequelize.models);
  Note.associate(sequelize.models);
  Category.associate(sequelize.models);
  NoteCategory.associate(sequelize.models);
}

module.exports = models;
