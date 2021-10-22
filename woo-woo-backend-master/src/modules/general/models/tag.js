'use strict';

const createTagModel = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      name: DataTypes.STRING,
      //defaultPrice: DataTypes.FLOAT,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['name'],
        },
      ],
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Review, {
      through: models.ReviewTag,
      foreignKey: 'tagId',
      otherKey: 'reviewId',
    });
  };
  return Tag;
};

export default createTagModel;
