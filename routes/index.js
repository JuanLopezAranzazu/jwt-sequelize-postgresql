const express = require("express");
const userRouter = require("./user.router");
const noteRouter = require("./note.router");
const categoryRouter = require("./category.router");
const authRouter = require("./auth.router");

function routes(app) {
  const router = express.Router();
  app.use("/api/v1", router);
  router.use("/users", userRouter);
  router.use("/notes", noteRouter);
  router.use("/categories", categoryRouter);
  router.use("/auth", authRouter);
}

module.exports = routes;
