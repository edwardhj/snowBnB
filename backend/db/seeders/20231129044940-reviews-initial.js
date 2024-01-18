'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');

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
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 5,
        review: 'What a cozy, clean, and warm home. Will definitely be back!',
        stars: 5
      },
      {
        spotId: 1,
        userId: 6,
        review: 'What a cozy, clean, and warm home. Too pricey!',
        stars: 3
      },
      {
        spotId: 1,
        userId: 1,
        review: 'Will definitely be back!',
        stars: 5
      },
      {
        spotId: 2,
        userId: 4,
        review: 'The views were breathtaking. The panoramic windows let the sun stream through the windows in the morning. This bnb is a bit too pricey to come here regularly, though.',
        stars: 4
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      review: { [Op.in]: ['What a cozy, clean, and warm home. Will definitely be back!', 'The views were breathtaking. The panoramic windows let the sun stream through the windows in the morning. This bnb is a bit too pricey to come here regularly, though.'] }
    }, {});
  }
};
