'use strict';
/**
 * Appointment model
 * @note because this is more a historical model
 * Need to de-normalize data (include service info), in the case healer change service info
 */
const createAppointmentModel = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      healerProfileId: DataTypes.INTEGER,
      clientId: DataTypes.INTEGER,
      sessionTime: DataTypes.DATE,
      sessionLength: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      serviceId: DataTypes.INTEGER,
      serviceName: DataTypes.STRING,
      status: DataTypes.STRING, // paid, canceled, booked
      paymentMethod: DataTypes.STRING,
      healerRequest: DataTypes.STRING, // cancel or re-schedule
      invoiceId: {
        type: DataTypes.STRING,
      },
      cleanUpTime: {
        type: DataTypes.INTEGER,
      },
      // need to add totalAmount (amount of payment including tax)
    },
    {
      indexes: [
        {
          unique: false,
          fields: ['clientId'],
        },
        {
          unique: false,
          fields: ['sessionTime'],
        },
        {
          unique: false,
          fields: ['serviceId'],
        },
        {
          unique: false,
          fields: ['healerProfileId'],
        },
        {
          unique: false,
          fields: ['status'],
        },
      ],
    }
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      as: 'healer',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });

    Appointment.belongsTo(models.User, {
      foreignKey: 'clientId',
      as: 'client',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });

    Appointment.belongsTo(models.Service, {
      foreignKey: 'serviceId',
      sourceKey: 'id',
    });

    Appointment.belongsTo(models.HealerProfile, {
      foreignKey: 'healerProfileId',
      as: 'appointment',
      sourceKey: 'id',
      onDelete: 'cascade',
      hooks: 'true',
    });

    Appointment.hasOne(models.Review, {
      foreignKey: 'appointmentId',
      sourceKey: 'id',
      as: 'review',
    });
  };
  return Appointment;
};

export default createAppointmentModel;
