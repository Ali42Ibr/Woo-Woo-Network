'use strict';

const createReviewTagModel = (sequelize, DataTypes) => {
  const ReviewTag = sequelize.define(
    'ReviewTag',
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['reviewId', 'tagId'],
        },
        {
          unique: true,
          fields: ['reviewId'],
        },
        {
          unique: true,
          fields: ['tagId'],
        },
      ],
    }
  );

  ReviewTag.associate = (models) => {
    ReviewTag.belongsTo(models.Review, {
      foreignKey: 'reviewId',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });

    ReviewTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });
  };
  return ReviewTag;
};

export default createReviewTagModel;
