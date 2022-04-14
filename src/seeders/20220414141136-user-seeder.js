'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          firstName: 'firstName - seeder',
          lastName: 'lastName - seeder',
          dayOfBirth: new Date(),
          password: '$2a$10$KyhrylCXJheNFqrFHhXHQeohgck4DrqIsHrYSvD4vf9Eyxr7F81yO',
          email: 'email1234@gmail.com',
          phoneNumber: '0123456789',
          role: 'ADMIN',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('Users', null, {});
     */
    await queryInterface.bulkDelete('Users', { email: 'email1234@gmail.com' }, {});
  },
};
