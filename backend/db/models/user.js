'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.belongsToMany(models.Spot, {
        through: 'Bookings',
        foreignKey: 'userId',
        otherKey: 'spotId',
        onDelete: 'CASCADE'
      }),
      User.hasMany(models.Spot, {
        foreignKey: 'ownerId',
        onDelete: 'CASCADE'
      }),
      User.hasMany(models.Review, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          CapitalLetter(value){
            if (value[0].toUpperCase() !== value[0]){
              throw new Error('Name must begin with a capital letter')
            }
          }
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          CapitalLetter(value){
            if (value[0].toUpperCase() !== value[0]){
              throw new Error('Name must begin with a capital letter')
            }
          }
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: {
            msg: 'Invalid email'
          }
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};