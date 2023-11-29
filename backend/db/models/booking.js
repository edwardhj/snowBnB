'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Booking.belongsToMany(models.Spot, {
        through: 'Bookings', // junction table name
        foreignKey: 'spotId', // Foreign key in the junction table
        otherKey: 'id', // Foreign key in the Spot table
        onDelete: 'CASCADE'
      });
      Booking.belongsToMany(models.User, {
        through: 'Bookings',
        foreignKey: 'userId',
        otherKey: 'id',
        onDelete: 'CASCADE'
      })
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};