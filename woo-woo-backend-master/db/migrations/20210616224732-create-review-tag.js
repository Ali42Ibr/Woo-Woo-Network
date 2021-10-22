'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ReviewTags', {
      reviewId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: {
          model: 'Reviews',
          key: 'id',
        },
      },
      tagId: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Tags',
          key: 'id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ReviewTags');
  },
};
