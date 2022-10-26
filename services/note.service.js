const { models } = require("../libs/sequelize");
const boom = require("@hapi/boom");

class NoteService {
  constructor() {}

  async findAll() {
    const notes = await models.Note.findAll({
      include: [
        {
          model: models.User,
          as: "user",
          attributes: { exclude: ["password"] },
        },
        { model: models.Category, as: "categories" },
      ],
    });
    return notes;
  }

  async findOne(id) {
    const note = await models.Note.findOne({
      where: { id },
      include: [
        {
          model: models.User,
          as: "user",
          attributes: { exclude: ["password"] },
        },
        { model: models.Category, as: "categories" },
      ],
    });
    if (!note) throw boom.notFound(`Note #${id} not found`);
    return note;
  }

  async addNoteCategories(payload) {
    const savedNoteCategory = await models.NoteCategory.create(payload);
    return savedNoteCategory;
  }

  async create(payload) {
    const savedNote = await models.Note.create(payload);
    return savedNote;
  }

  async update(id, payload) {
    const note = await this.findOne(id);
    if (!note) throw boom.notFound(`Note #${id} not found`);
    const updatedNote = await note.update(payload);
    return updatedNote;
  }

  async delete(id) {
    const note = await this.findOne(id);
    if (!note) throw boom.notFound(`Note #${id} not found`);
    await note.destroy();
    return id;
  }
}

module.exports = NoteService;
