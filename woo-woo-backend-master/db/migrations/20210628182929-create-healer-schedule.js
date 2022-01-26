'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HealerSchedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      healerProfileId: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'HealerProfiles',
          key: 'id',
        },
      },
      
      startTime: {
        allowNull: false,
        type: Sequelize.DATE, // year should be 20** at this point
      },
      endTime: {
        allowNull: false,
        type: Sequelize.DATE, // month should be 1 - 12
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
    await queryInterface.dropTable('HealerSchedules');
  },
};
