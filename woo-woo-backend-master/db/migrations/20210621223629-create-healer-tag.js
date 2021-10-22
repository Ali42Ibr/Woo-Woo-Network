'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('HealerTags', {
      healerProfileId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'HealerProfiles',
          key: 'id',
        },
      },
      tagId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Tags',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('HealerTags');
  },
};
