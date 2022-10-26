const express = require("express");
const categoryRouter = express.Router();

const CategoryService = require("../services/category.service");
const categoryService = new CategoryService();

const validatorHandler = require("./../middlewares/validatorHandler");
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} = require("./../schemas/category.schema");

const { verifyToken } = require("./../middlewares/userExtractor");

categoryRouter.get("/", verifyToken, async (req, res, next) => {
  try {
    const categories = await categoryService.findAll();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

categoryRouter.get(
  "/:id",
  verifyToken,
  validatorHandler(getCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const category = await categoryService.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.post(
  "/",
  verifyToken,
  validatorHandler(createCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req;
      console.log(body);
      const savedCategory = await categoryService.create(body);
      console.log(savedCategory);
      res.status(201).json(savedCategory);
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.put(
  "/:id",
  verifyToken,
  validatorHandler(getCategorySchema, "params"),
  validatorHandler(updateCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const { body, params } = req;
      console.log(body, params);
      const { id } = params;
      const updatedCategory = await categoryService.update(id, body);
      console.log(updatedCategory);
      res.json(updatedCategory);
    } catch (error) {
      next(error);
    }
  }
);

categoryRouter.delete(
  "/:id",
  verifyToken,
  validatorHandler(getCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const categoryId = await categoryService.delete(id);
      res.status(204).json(categoryId);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = categoryRouter;
