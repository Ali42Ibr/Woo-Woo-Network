'use strict';

const createHealerScheduleModel = (sequelize, DataTypes) => {
  const HealerSchedule = sequelize.define(
    'HealerSchedule',
    {
      healerProfileId: {
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {}
  );
  HealerSchedule.associate = (models) => {
    HealerSchedule.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      sourceKey: 'id',
      as: 'healerProfile',
      onDelete: 'cascade',
      hooks: 'true',
    });
  };
  return HealerSchedule;
};

export default createHealerScheduleModel;
