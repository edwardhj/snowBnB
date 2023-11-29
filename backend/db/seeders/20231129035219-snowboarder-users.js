'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   try {
    await User.bulkCreate([
      {
        email: 'edwardjung2018@gmail.com',
        firstName: 'Edward',
        lastName: 'Jung',
        username: 'ejungie',
        hashedPassword: bcrypt.hashSync('happy123')
      },
      {
        email: 'lizziepark@gmail.com',
        firstName: 'Elizabeth',
        lastName: 'Heather',
        username: 'lizzo',
        hashedPassword: bcrypt.hashSync('sad123')
      },
      {
        email: 'krakra@gmail.com',
        firstName: 'Kevin',
        lastName: 'Rockefeller',
        username: 'krakra',
        hashedPassword: bcrypt.hashSync('lit123')
      }
     ], { validate: true })
   } catch (error) {
    console.log(error)
   }

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['krakra', 'ejungie', 'lizzo'] }
    }, {});
  }
};
