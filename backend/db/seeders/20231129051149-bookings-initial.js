'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Booking } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const startDate1 = '2024-01-01T12:00:00.000Z';
const endDate1 = '2024-01-05T12:00:00.000Z';

const startDate2 = '2024-02-01T12:00:00.000Z';
const endDate2 = '2024-02-05T12:00:00.000Z';

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
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 5,
        startDate: startDate1,
        endDate: endDate1
      },
      {
        spotId: 2,
        userId: 4,
        startDate: startDate2,
        endDate: endDate2
      }
     ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      startDate: { [Op.in]: [new Date(startDate1), new Date(startDate2)] }
    }, {});
  }
};
