const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Promotion code is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Discount type is required'
      }
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Discount amount must be non-negative'
      }
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  timestamps: true,
  tableName: 'Promotions',
  validate: {
    datesCheck() {
      if (this.startDate && this.endDate && this.startDate >= this.endDate) {
        throw new Error('End date must be after start date.');
      }
    }
  },
  indexes: [
    {
      unique: true,
      fields: ['code']
    },
    {
      fields: ['isActive', 'startDate', 'endDate']
    }
  ]
});

module.exports = Promotion;
