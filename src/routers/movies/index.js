"use strict";
const express = require("express");
const { Movie } = require("../../../models");
const { getAllMovies, createMovie } = require("../../services/movies");

const movieRouter = express.Router();

movieRouter.get("/", async (req, res) => {
  const movies = await getAllMovies();
  if (!movies) {
    res.status(500).send("can not get movie list");
  }
  res.status(200).send(movies);
});

movieRouter.post("/", async (req, res) => {
  const { name, trailer, poster, description, startTime, evaluate } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send("name is required");
  }

  const movie = await createMovie({
    name,
    trailer,
    poster,
    description,
    startTime,
    evaluate,
  });
  if (!movie) {
    res.status(500).send("can not create movie");
  }
  res.status(201).send(movie);
});

module.exports = movieRouter;
