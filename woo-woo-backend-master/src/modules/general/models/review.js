'use strict';

const createReviewModel = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    'Review',
    {
      reviewerId: DataTypes.INTEGER,
      appointmentId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
        allowNull: false,
      },
      description: DataTypes.STRING,
      rating: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
        allowNull: false,
      },
      photo: DataTypes.STRING,
      //defaultPrice: DataTypes.FLOAT,
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['reviewerId'],
        },
        {
          unique: false,
          fields: ['appointmentId'],
        },
      ],
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.User, {
      foreignKey: 'reviewerId',
      sourceKey: 'id',
      as: 'reviewer',
      onDelete: 'cascade',
      hooks: 'true',
    });

    Review.belongsTo(models.Appointment, {
      foreignKey: 'appointmentId',
      sourceKey: 'id',
      as: 'appointment',
      onDelete: 'cascade',
      hooks: 'true',
    });
    Review.belongsToMany(models.Tag, {
      through: models.ReviewTag,
      as: 'tags',
      foreignKey: 'reviewId',
      otherKey: 'tagId',
    });
    //Review.hasMany(models.ReviewTag);
  };
  return Review;
};

export default createReviewModel;
