const Joi = require("joi");

const id = Joi.number().integer();
const fullname = Joi.string();
const username = Joi.string();
const password = Joi.string();

const createUserSchema = Joi.object({
  fullname: fullname.required(),
  username: username.required(),
  password: password.required(),
});

const updateUserSchema = Joi.object({
  fullname: fullname,
  username: username,
  password: password,
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
};
