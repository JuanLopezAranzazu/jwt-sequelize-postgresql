const express = require("express");
const noteRouter = express.Router();

const NoteService = require("../services/note.service");
const noteService = new NoteService();

const validatorHandler = require("./../middlewares/validatorHandler");
const {
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema,
  addNoteCategorySchema,
} = require("./../schemas/note.schema");

const { verifyToken } = require("./../middlewares/userExtractor");

noteRouter.get("/", verifyToken, async (req, res, next) => {
  try {
    const notes = await noteService.findAll();
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

noteRouter.get(
  "/:id",
  verifyToken,
  validatorHandler(getNoteSchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const note = await noteService.findOne(id);
      res.json(note);
    } catch (error) {
      next(error);
    }
  }
);

noteRouter.post(
  "/",
  verifyToken,
  validatorHandler(createNoteSchema, "body"),
  async (req, res, next) => {
    try {
      const { body, user } = req;
      const { title, url } = body;
      console.log(body);
      const dataForNote = {
        title,
        url,
        userId: user.id,
      };
      const savedNote = await noteService.create(dataForNote);
      console.log(savedNote);
      res.status(201).json(savedNote);
    } catch (error) {
      next(error);
    }
  }
);

noteRouter.post(
  "/category",
  validatorHandler(addNoteCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req;
      console.log(body);
      const savedNoteCategory = await noteService.addNoteCategories(body);
      console.log(savedNoteCategory);
      res.status(201).json(savedNoteCategory);
    } catch (error) {
      next(error);
    }
  }
);

noteRouter.put(
  "/:id",
  verifyToken,
  validatorHandler(getNoteSchema, "params"),
  validatorHandler(updateNoteSchema, "body"),
  async (req, res, next) => {
    try {
      const { body, user, params } = req;
      const { title, url } = body;
      const { id } = params;
      console.log(body, user, params);
      const dataForNote = {
        title,
        url,
        userId: user.id,
      };
      const updatedNote = await noteService.update(id, dataForNote);
      console.log(updatedNote);
      res.json(updatedNote);
    } catch (error) {
      next(error);
    }
  }
);

noteRouter.delete(
  "/:id",
  verifyToken,
  validatorHandler(getNoteSchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const noteId = await noteService.delete(id);
      res.status(204).json(noteId);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = noteRouter;
