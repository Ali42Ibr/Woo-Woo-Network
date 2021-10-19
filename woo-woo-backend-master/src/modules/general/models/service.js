'use strict';

const createServiceModel = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    'Service',
    {
      healerProfileId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'Service name should be between 3 and 15',
          },
        },
      },
      price: {
        type: DataTypes.FLOAT,
        validate: {
          isFloat: true,
        },
      },
      description: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [0, 255],
            msg: 'Service description should be less than 255 characters',
          },
        },
      },
      timeLength: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
      },
      cleanUpTime: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
        defaultValue: 0,
      },
      isAvailableOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

  Service.associate = (models) => {
    Service.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      sourceKey: 'id',
      as: 'healerProfile',
      onDelete: 'cascade',
      hooks: 'true',
    });
  };
  return Service;
};

export default createServiceModel;
