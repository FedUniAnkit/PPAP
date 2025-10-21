const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add isTemporaryPassword column
    await queryInterface.addColumn('Users', 'isTemporaryPassword', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });

    // Add accountStatus column
    await queryInterface.addColumn('Users', 'accountStatus', {
      type: DataTypes.ENUM('active', 'pending_staff_registration', 'inactive'),
      defaultValue: 'active',
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns in reverse order
    await queryInterface.removeColumn('Users', 'accountStatus');
    await queryInterface.removeColumn('Users', 'isTemporaryPassword');
  }
};
