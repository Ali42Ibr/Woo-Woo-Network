'use strict';

const createHealerTagModel = (sequelize, DataTypes) => {
  const HealerTag = sequelize.define(
    'HealerTag',
    {
      healerProfileId: {
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
          fields: ['healerProfileId', 'tagId'],
        },
        {
          unique: false,
          fields: ['healerProfileId'],
        },
        {
          unique: false,
          fields: ['tagId'],
        },
      ],
    }
  );

  HealerTag.associate = (models) => {
    HealerTag.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });

    HealerTag.belongsTo(models.Tag, {
      foreignKey: 'tagId',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });
  };
  return HealerTag;
};

export default createHealerTagModel;
