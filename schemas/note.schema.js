const Joi = require("joi");

const id = Joi.number().integer();
const title = Joi.string();
const url = Joi.string().uri();
const noteId = Joi.number().integer();
const categoryId = Joi.number().integer();

const createNoteSchema = Joi.object({
  title: title.required(),
  url: url.required(),
});

const addNoteCategorySchema = Joi.object({
  noteId: noteId.required(),
  categoryId: categoryId.required(),
});

const updateNoteSchema = Joi.object({
  title: title,
  url: url,
});

const getNoteSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createNoteSchema,
  addNoteCategorySchema,
  updateNoteSchema,
  getNoteSchema,
};
