'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toJSON() {
      const attributes = Object.assign({}, this.get());

      delete attributes.password;
      return attributes;
    }
    static associate({ Avatar, Movie, Ticket }) {
      this.hasMany(Avatar, {
        foreignKey: 'userId',
        as: 'avatars',
      });
      this.hasOne(Avatar, {
        foreignKey: 'userId',
        as: 'avatar',
      });
      this.belongsToMany(Movie, { through: Ticket, as: 'movies' });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      dayOfBirth: DataTypes.DATE,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
