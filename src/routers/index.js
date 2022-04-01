"use strict";
const express = require("express");
const movieRouter = require("./movies");
const userRouter = require("./users");

const rootRouter = express.Router();

rootRouter.use("/movies", movieRouter);

rootRouter.use("/users", userRouter);

module.exports = rootRouter;
