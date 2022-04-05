"use strict";
const bcrypt = require("bcryptjs");

const scriptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashed = bcrypt.hashSync(password, salt);
  return hashed;
};

const comparePassword = (password, passwordHashed) => {
  const isMatch = bcrypt.compareSync(password, passwordHashed);
  return isMatch;
};

module.exports = {
  scriptPassword,
  comparePassword,
};
