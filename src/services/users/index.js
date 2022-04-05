"use strict";

const { User } = require("../../../models");

const createUser = async (data) => {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    return null;
  }
};

const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};
