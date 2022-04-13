'use strict';

const { Op } = require('sequelize');
const { User, Avatar } = require('../../../models');

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
    console.log({user})
    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

const storageAvatar = async (userId, url) => {
  try {
    // const avatar = await Avatar.create({
    //   url,
    //   userId,
    //   isActive: true,
    // });

    // await Avatar.update(
    //   { isActive: false },
    //   {
    //     where: {
    //       userId,
    //       id: {
    //         [Op.not]: avatar.id,
    //       },
    //     },
    //   }
    // );

    // return avatar;
  } catch (error) {
    return null;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  // storageAvatar,
};
