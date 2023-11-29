'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

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
    await Spot.bulkCreate([
      {
        ownerId: 4,
        address: '453 Catalina Rd',
        city: 'BigBearLake',
        state: 'CA',
        country: 'USA',
        lat: 34.24425,
        lng: -116.87857,
        name: 'Wanderlust Lodge',
        description: 'Warm, cozy cabin that has 7 beds in 4 bedrooms. This cabin can comfortably sleep up to 11 guests. There are 2 jetted bathtubs and a game area. Reservations cannot be cancelled due to weather variances. Always check the weather report as snow chains may be required by the city.',
        price: 500
      },
      {
        ownerId: 5,
        address: '5808 Minaret Rd',
        city: 'MammothLakes',
        state: 'CA',
        country: 'USA',
        lat: 37.64596,
        lng: -118.98236,
        name: 'Pinecone Paradise',
        description: 'This luxurious home, located within the Stonegate Mammoth Luxury Homes Community, features over 4000 sq ft of living space. Additionally, there are 10 bedrooms, a library, a separate living room, a game room, and a breathtaking view of the snow-capped mountain. Relax and enjoy the views set by the panoramic windows. This home has a 2 car garage and driveway that can accommodate up to 3 more vehicles. A private laundry room on the middle level gets the chores done, and an additional powder room. This home is located just a stones throw away from the Eagle Express Lupin run where you can ski down from the home, cross the road and ski down to Eagle Lodge on the access path, providing the ultimate convenience. If you are looking for something special and a unique vacation have come to the right place! There is room for all of the family to spread out.',
        price: 2500
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
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Pinecone Paradise', 'Wanderlust Lodge'] }
    }, {});
  }
};
