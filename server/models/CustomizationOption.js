const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CustomizationOption = sequelize.define('CustomizationOption', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  optionType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      isIn: {
        args: [['size', 'crust', 'sauce', 'cheese', 'topping']],
        msg: 'Option type must be one of: size, crust, sauce, cheese, topping'
      }
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Option name is required'
      }
    }
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Display name is required'
      }
    }
  },
  priceModifier: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    validate: {
      min: {
        args: [-50.00],
        msg: 'Price modifier cannot be less than -$50.00'
      }
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true // Only used for toppings: 'veg', 'protein', 'premium'
  },
  dietaryInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['optionType']
    },
    {
      fields: ['category']
    },
    {
      fields: ['isAvailable']
    },
    {
      fields: ['sortOrder']
    }
  ]
});

module.exports = CustomizationOption;
