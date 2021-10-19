'use strict';

const createHealerProfileModel = (sequelize, DataTypes) => {
  const HealerProfile = sequelize.define(
    'HealerProfile',
    {
      accountId: DataTypes.INTEGER,
      description: DataTypes.STRING,
      brandName: DataTypes.STRING,
      paymentAccountId: {
        type: DataTypes.STRING,
        unique: true,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: 'cad',
      },
      //defaultPrice: DataTypes.FLOAT,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['accountId'],
        },
      ],
    }
  );

  HealerProfile.associate = (models) => {
    HealerProfile.belongsTo(models.User, {
      foreignKey: 'accountId',
      sourceKey: 'id',
      as: 'account',
      onDelete: 'cascade',
      hooks: 'true',
    });
    // HealerProfile.hasMany(models.Review, {
    //   as: 'healerProfile',
    //   foreignKey: 'healerProfileId',
    // });

    HealerProfile.hasMany(models.Service, {
      foreignKey: 'healerProfileId',
    });

    HealerProfile.belongsToMany(models.Tag, {
      through: models.HealerTag,
      as: 'tags',
      foreignKey: 'healerProfileId',
      otherKey: 'tagId',
    });

    HealerProfile.hasOne(models.CancelFee, {
      foreignKey: 'healerProfileId',
    });
  };
  return HealerProfile;
};

export default createHealerProfileModel;
