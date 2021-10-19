'use strict';

const createLocationModel = (sequelize, DataTypes) => {
  const Location = sequelize.define(
    'Location',
    {
      // need to find validation tool to add on
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      province: DataTypes.STRING,
      country: DataTypes.STRING,
      postalCode: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['userId'],
        },
      ],
    }
  );
  Location.associate = (models) => {
    // location belong to user instead of healer
    // later on user can provide their address be some other purpose
    Location.belongsTo(models.User, {
      foreignKey: 'userId',
      sourceKey: 'id',
    });
  };
  return Location;
};

export default createLocationModel;
