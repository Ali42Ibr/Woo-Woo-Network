// some helper functions -> will move to helper file

import moment from 'moment-timezone';
import { BOOKED, PAID } from '../general/utils/appointment-status';
import { NotFound } from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';
import jwtHelper from '../general/utils/jwt-helper';
import { Op } from 'sequelize';
import { Forbidden } from '../general/middlewares/error-handle-middleware/error-code';

// firstDate and secondDate is string type
const sortDateAsc = (firstDate, secondDate) => {
  const first = new Date(firstDate).getTime();
  const second = new Date(secondDate).getTime();
  return first > second ? 1 : -1;
};

const getDefaultTimezone = () => {
  return 'America/Los_Angeles';
};

const getDefaultStartDateTime = (date, timezone) => {
  return moment.tz(`${date} 00:00`, timezone).format();
};

const getDefaultEndDateTime = (date, timezone) => {
  return moment.tz(`${date} 23:59`, timezone).format();
};

/**
 * Get time string in HH:MM format
 */
const getTimeString = (dateTime, timezone) => {
  return moment(dateTime).tz(timezone).format('HH:mm');
};

const getHealerProfileId = async (token) => {
  const { user_id } = jwtHelper.getJWTInfo(token);
  const healerProfile = await db.HealerProfile.findOne({
    attributes: ['id'],
    include: {
      model: db.User,
      as: 'account',
      where: {
        uid: user_id,
      },
    },
  });
  if (healerProfile == null) {
    throw new NotFound();
  }
  return healerProfile.dataValues.id;
};

const checkBookedAppointment = async ({
  startTime,
  endTime,
  healerProfileId,
}) => {
  const appointmentList = await db.Appointment.findAll({
    where: {
      healerProfileId,
      [Op.or]: [
        {
          sessionTime: {
            [Op.between]: [moment(startTime).subtract(30, 'seconds'), endTime],
          },
          status: PAID,
        },
        {
          sessionTime: {
            [Op.between]: [moment(startTime).subtract(30, 'seconds'), endTime],
          },
          createdAt: {
            // within 1 hour
            [Op.between]: [
              moment().subtract(1, 'hours'),
              moment().add(10, 'minutes'), // this is just the case some conflict saved,
            ],
          },
          status: BOOKED,
        },
      ],
    },
    limit: 1,
  });
  if (appointmentList.length > 0) {
    throw new Forbidden(
      'There are some appointment during these periods. Need to ask client re-schedule before update'
    );
  }
};

export default {
  sortDateAsc,
  getDefaultTimezone,
  getDefaultEndDateTime,
  getDefaultStartDateTime,
  getTimeString,
  getHealerProfileId,
  checkBookedAppointment,
};
