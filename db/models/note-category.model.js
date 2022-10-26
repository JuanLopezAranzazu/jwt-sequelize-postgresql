const { Model, DataTypes, Sequelize } = require("sequelize");
const { NOTE_TABLE } = require("./note.model");
const { CATEGORY_TABLE } = require("./category.model");
const NOTE_CATEGORY_TABLE = "notes_categories";

const NoteCategorySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  noteId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: NOTE_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CATEGORY_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class NoteCategory extends Model {
  static associate(models) {}
  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTE_CATEGORY_TABLE,
      modelName: "NoteCategory",
      timestamps: false,
    };
  }
}
module.exports = { NoteCategory, NoteCategorySchema, NOTE_CATEGORY_TABLE };
