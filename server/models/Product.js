const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name is required'
      },
      len: {
        args: [2, 100],
        msg: 'Product name must be between 2 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product description is required'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be greater than or equal to 0'
      }
    }
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  subcategory: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  ingredients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  sizes: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: []
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  preparationTime: {
    type: DataTypes.INTEGER,
    defaultValue: 15,
    validate: {
      min: {
        args: [1],
        msg: 'Preparation time must be at least 1 minute'
      }
    }
  },
  nutritionalInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  dietaryInfo: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  customizationOptions: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: {}
  },
  allergens: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: []
  },
  spiceLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  isPopular: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['isAvailable']
    }
  ]
});

module.exports = Product;
