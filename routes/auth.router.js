const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { config } = require("./../config/config");

const UserService = require("../services/user.service");
const userService = new UserService();

const Joi = require("joi");

const username = Joi.string();
const password = Joi.string();

const loginUserSchema = Joi.object({
  username: username.required(),
  password: password.required(),
});

const validatorHandler = require("./../middlewares/validatorHandler");

authRouter.post(
  "/",
  validatorHandler(loginUserSchema, "body"),
  async (req, res, next) => {
    try {
      const { body } = req;
      const { username, password } = body;
      console.log(body);

      const user = await userService.findByUsername(username);
      console.log("entro", user);

      const passwordCorrect =
        user === null ? false : await bcrypt.compare(password, user.password);

      if (!(user && passwordCorrect)) {
        res.status(401).json({
          error: "invalid user or password",
        });
      }

      const userForToken = {
        id: user.id,
        username: user.username,
      };
      console.log(userForToken);

      const token = jwt.sign(userForToken, config.secretKey, {
        expiresIn: "1h",
      });

      res.send({
        fullname: user.fullname,
        username: user.username,
        token,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = authRouter;
