'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Services', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      description: {
        type: Sequelize.STRING,
      },
      timeLength: {
        type: Sequelize.INTEGER,
      },
      cleanUpTime: {
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
      isAvailableOnline: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Services');
  },
};
