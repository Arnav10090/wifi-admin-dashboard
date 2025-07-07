'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAttribute extends Model {
    static associate(models) {
      UserAttribute.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  UserAttribute.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'UserAttribute',
  });
  return UserAttribute;
}; 