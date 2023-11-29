'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE'
      }),
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      }),
      Spot.hasMany(models.SpotImages, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlpha: true
      }
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        min: 0.01,
        isNumeric: true
      }
    },
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};