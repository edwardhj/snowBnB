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
        spotId: 1,
        url: "https://www.travelandleisure.com/thmb/1UriZXh9SkDeMLDTWk_c51GX8Sk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/firefly-cabin-interior-big-bear-ca-MIDNIGHTMOON0322-8bbc4eeed9d0496ca95942a314823c3d.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://cdn.apartmenttherapy.info/image/upload/v1556037540/at/house%20tours/archive/big%20bear/0c8d59a36bdab405d75dcddf06b540319d118bf1.jpg",
        preview: false
      },
      {
        spotId: 1,
        url: "https://floydhome.com/cdn/shop/articles/stay-floyd-big-bear.jpg?v=1641923064",
        preview: false
      },
      {
        spotId: 1,
        url: "https://media.cntraveler.com/photos/6169a36c811903eb81788b28/master/w_1600%2Cc_limit/Airbnb%252049956177.jpg",
        preview: false
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
