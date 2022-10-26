const { Model, DataTypes, Sequelize } = require("sequelize");
const NOTE_TABLE = "note";
const { USER_TABLE } = require("./user.model");

const NoteSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  url: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  userId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Note extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    this.belongsToMany(models.Category, {
      as: "categories",
      through: models.NoteCategory,
      foreignKey: "noteId",
      otherKey: "categoryId",
    });
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: NOTE_TABLE,
      modelName: "Note",
      timestamps: false,
    };
  }
}

module.exports = { NOTE_TABLE, NoteSchema, Note };
