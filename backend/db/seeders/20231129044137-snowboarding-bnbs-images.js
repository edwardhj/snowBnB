'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');

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
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://skyhighcabins.com/wp-content/uploads/2023/10/060-Lakefront-Modern-A-Frame-Big-Bear-Vacation-Rentals.webp",
        preview: true
      },
      {
        spotId: 2,
        url: 'https://static.trip101.com/main_pics/170314/medium.jpg',
        preview: true
      },
      {
        spotId: 3,
        url: "https://assets.site-static.com/userFiles/453/image/CANYON_SKI__RACQUET_CONDO.jpg",
        preview: true
      },
      {
        spotId: 4,
        url: "https://ap.rdcpix.com/3be6b0db319422cf01b5ed0117050b0el-m3271974147od-w480_h480_q80.jpg",
        preview: true
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
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
