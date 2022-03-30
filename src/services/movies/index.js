"use strict";
const { Movie } = require("../../../models");

const getAllMovies = async () => {
  try {
    const movies = await Movie.findAll();
    return movies;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createMovie = async (movie) => {
  try {
    const newMovie = await Movie.create(movie);

    return newMovie;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

module.exports = {
  getAllMovies,
  createMovie
};
