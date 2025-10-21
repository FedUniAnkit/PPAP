const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

class ContentBlock extends Model {}

ContentBlock.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('text', 'html', 'markdown', 'image_url', 'json'),
    allowNull: false,
    defaultValue: 'text',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  lastUpdatedBy: {
    type: DataTypes.UUID,
    references: {
      model: 'Users',
      key: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'ContentBlock',
  timestamps: true,
});

module.exports = ContentBlock;
