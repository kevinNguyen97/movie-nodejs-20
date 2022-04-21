const { User, Avatar } = require('../models');
const { scriptPassword } = require('../services/auth');
const { createUser, getUserById } = require('../services/users');

const graphqlResolvers = {
  async getAllUser() {
    try {
      const userList = await User.findAll({
        include: [
          {
            model: Avatar,
            as: 'avatar',
            where: {
              isActive: true,
            },
          },
          {
            model: Avatar,
            as: 'avatars',
          },
        ],
      });
      return userList;
    } catch (error) {
      throw new Error(error);
    }
  },
  async getUserById(params) {
    const id = params?.id;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('error roi ban oi');
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  },
  async createUser({ userInput }) {
    const { firstName, lastName, dayOfBirth, email, password, phoneNumber } = userInput;

    const passwordHashed = scriptPassword(password);

    const data = await createUser({
      firstName,
      lastName,
      dayOfBirth,
      email,
      password: passwordHashed,
      phoneNumber,
      role: 'USER',
    });

    if (!data) {
      throw new Error('can not create user');
    }

    return data;
  },
  async updateUser({ userInput, id: userId }) {
    const { firstName, lastName, dayOfBirth, email, password, phoneNumber } = userInput;

    const passwordHashed = scriptPassword(password);

    const user = await getUserById(userId);

    if (!user) {
      throw new Error(`user id ${userId} is not exist`);
    }

    
  },
};

module.exports = graphqlResolvers;
