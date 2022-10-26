const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

const UserService = require("../services/user.service");
const userService = new UserService();
const validatorHandler = require("./../middlewares/validatorHandler");
const {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
} = require("./../schemas/user.schema");

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const user = await userService.findOne(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.post(
  "/",
  validatorHandler(createUserSchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req;
      const { name, username, password } = body;
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const dataForUser = {
        name,
        username,
        password: passwordHash,
      };
      const savedUser = await userService.create(dataForUser);
      res.status(201).json(savedUser);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.put(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  validatorHandler(updateUserSchema, "body"),
  async (req, res, next) => {
    try {
      const { params, body } = req;
      const { id } = params;
      const { name, username, password } = body;
      console.log(id, body);
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const dataForUser = {
        name,
        username,
        password: passwordHash,
      };
      const updatedUser = await userService.update(id, dataForUser);
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.delete(
  "/:id",
  validatorHandler(getUserSchema, "params"),
  async (req, res, next) => {
    try {
      const { params } = req;
      const { id } = params;
      console.log(id);
      const userId = await userService.delete(id);
      res.status(204).json(userId);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = userRouter;
