'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Appointments', {
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
      clientId: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Users',
          key: 'id',
        },
      },
      sessionTime: {
        type: Sequelize.DATE,
      },
      sessionLength: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      serviceId: {
        type: Sequelize.INTEGER,
      },
      serviceName: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING, // booked - payed - canceled
      },
      paymentMethod: {
        type: Sequelize.STRING,
      },
      healerRequest: {
        type: Sequelize.STRING,
      },
      invoiceId: {
        type: Sequelize.STRING,
      },
      cleanUpTime: {
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
    await queryInterface.dropTable('Appointments');
  },
};
