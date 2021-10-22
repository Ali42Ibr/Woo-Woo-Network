'use strict';

const createCancelFeeModel = (sequelize, DataTypes) => {
  const CancelFee = sequelize.define(
    'CancelFee',
    {
      healerProfileId: DataTypes.INTEGER,
      fee: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      appliedDay: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
      },
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['healerProfileId'],
        },
      ],
    }
  );
  CancelFee.associate = (models) => {
    CancelFee.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      sourceKey: 'id',
    });
  };
  return CancelFee;
};

export default createCancelFeeModel;
