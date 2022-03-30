"use strict";
const express = require("express");
const movieRouter = require("./movies");

const rootRouter = express.Router();

rootRouter.use("/movies", movieRouter);

module.exports = rootRouter;
