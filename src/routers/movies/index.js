'use strict';
const express = require('express');
const { Movie } = require('../../models');
const { authenticate, checkRole } = require('../../middlewares/auth');
const { decodeToken } = require('../../services/auth');
const {
  getAllMovies,
  createMovie,
  checkExistMovieById,
  deleteMovieById,
  getMovieById,
  updateMovieById,
} = require('../../services/movies');

const movieRouter = express.Router();

movieRouter.get('/', async (req, res) => {
  const movies = await getAllMovies();
  if (!movies) {
    res.status(500).send('can not get movie list');
  }
  res.status(200).send(movies);
});

movieRouter.post('/', async (req, res) => {
  const { name, trailer, poster, description, startTime, evaluate } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send('name is required');
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
    res.status(500).send('can not create movie');
  }
  res.status(201).send(movie);
});

movieRouter.delete('/:id', [authenticate, checkRole('ADMIN')], async (req, res) => {
  const { id } = req.params;

  const isExistedMovie = await checkExistMovieById(id);

  if (!isExistedMovie) {
    return res.status(404).send(`movie id ${id} is not exist on db`);
  }

  const item = await deleteMovieById(id);

  if (!item) {
    return res.status(500).send(`can not delete movie id ${id}`);
  }
  res.status(200).send(`movie id ${id} deleted`);
});

movieRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const movie = await getMovieById(id);

  if (!movie) {
    return res.status(404).send(`movie id ${id} is not exist on db`);
  }

  res.status(200).send(movie);
});

movieRouter.put('/:id', async (req, res) => {
  const { id } = req.params;

  const { name, trailer, poster, description, startTime, evaluate } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send('name is required');
  }

  const isExistMovie = await checkExistMovieById(id);

  if (!isExistMovie) {
    return res.status(404).send(`movie id ${id} is not exist on db`);
  }
  const data = {
    name,
    trailer,
    poster,
    description,
    startTime,
    evaluate,
  };
  await updateMovieById(id, data);

  res.status(200).send(data);
});

module.exports = movieRouter;
