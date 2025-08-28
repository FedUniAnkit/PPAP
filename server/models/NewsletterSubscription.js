const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class NewsletterSubscription extends Model {}

NewsletterSubscription.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'NewsletterSubscription',
  timestamps: true,
});

module.exports = NewsletterSubscription;
