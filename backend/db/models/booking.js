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
      Booking.belongsTo(models.Spot, {
        foreignKey: 'spotId', // Foreign key in the Booking table
        onDelete: 'CASCADE'
      });
      Booking.belongsTo(models.User, {
        foreignKey: 'userId', // Foreign key in the Booking table
        onDelete: 'CASCADE'
      });
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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: true,
        isInFuture(value){
          const today = new Date();
          if (new Date(value) < today) {
            throw new Error('Start date must be in the future')
          }
        }
      }
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value){
          if (new Date(value) <= new Date(this.startDate)){
            throw new Error('End date must be after start date')
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};