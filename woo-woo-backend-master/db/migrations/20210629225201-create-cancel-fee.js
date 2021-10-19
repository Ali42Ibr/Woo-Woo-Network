'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('CancelFees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      healerProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'HealerProfiles',
          key: 'id',
        },
      },
      fee: {
        type: Sequelize.FLOAT,
      },
      // the day to apply the fee from the appointment date
      appliedDay: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('CancelFees');
  },
};
