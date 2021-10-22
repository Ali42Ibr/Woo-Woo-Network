import moment from 'moment-timezone';
import { Op, Sequelize } from 'sequelize';
import db from '../../general/models';

import { BadRequest } from '../../general/middlewares/error-handle-middleware/error-code';
import { BOOKED, PAID } from '../../general/utils/appointment-status';
/**
 * Generate bookable slot list (only start time)
 * @param startTime: start of working period
 * @param endTime: end of working period
 * @intervalTime the interval time for 1 slot (minutes)
 * @blockTime the time already booked
 */

const findTimeSlot = ({
  start,
  end,
  intervalTime,
  blockTimeList,
  timezone,
}) => {
  // find interval time
  const interval = Math.ceil(intervalTime / 5) * 5; // the minimum interval time is 15 minutes

  // find unblocked time
  const unblockedPeriods = [{ start, end }];
  // need to test this one later on
  blockTimeList.forEach((blockTime) => {
    const blockTimeLength = Math.ceil(blockTime.timeLength / 5) * 5;
    for (let i = 0; i < unblockedPeriods.length; i++) {
      if (
        moment(blockTime.sessionTime).isBetween(
          unblockedPeriods[i].start,
          unblockedPeriods[i].end
        )
      ) {
        unblockedPeriods.splice(
          i,
          1,
          {
            start: unblockedPeriods[i].start,
            end: blockTimeLength,
          },
          {
            start: moment(blockTime.sessionTime).add(
              blockTimeLength,
              'minutes'
            ),
            end: unblockedPeriods[i].end,
          }
        );
        break; // stop looping inside for each
      } else if (
        moment(blockTime.sessionTime).isSame(
          moment(unblockedPeriods[i].start),
          'minute'
        )
      ) {
        unblockedPeriods.splice(i, 1, {
          start: moment
            .tz(blockTime.sessionTime, timezone)
            .add(blockTimeLength, 'minutes')
            .format(),
          end: unblockedPeriods[i].end,
        });
        break; // stop looping inside for each
      }
    }
  });

  // generate time slot
  const timeSlotList = [];
  for (let period of unblockedPeriods) {
    const duration = moment
      .duration(moment(period.end).diff(moment.tz(period.start, timezone)))
      .asMinutes();

    const possibleSlotCount = Math.floor(duration / interval);

    // generate slots
    for (let i = 0; i < possibleSlotCount; i++) {
      timeSlotList.push(
        moment
          .tz(period.start, timezone)
          .add(i * interval, 'minutes')
          .format('HH:mm')
      );
    }
  }
  return timeSlotList;
};

const generateDateList = ({ startDate, endDate }) => {
  console.log(startDate);
  const duration = moment.duration(moment(endDate).diff(startDate)).asDays();
  // get date list from start to endDate
  const dates = [startDate];
  for (let i = 1; i <= duration; i++) {
    dates.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'));
  }
  return dates;
};

const getIntervalTime = async (healerProfileId) => {
  // set services time (length and clean up time) -> get the smallest one
  const service = await db.Service.findAll({
    attributes: [[Sequelize.literal('"timeLength"+"cleanUpTime"'), 'time']],
    order: [[Sequelize.literal('"timeLength"+"cleanUpTime"'), 'ASC']],
    limit: 1,
    where: {
      healerProfileId,
    },
  });

  if (service.length <= 0) {
    throw new BadRequest('Healer does not have service to book');
  }
  const intervalTime = service[0].dataValues.time;
  return intervalTime;
};

// miss logic to handle slots overlay the later part of appointment
const getBookedSlots = async ({ startTime, endTime, healerProfileId }) => {
  endTime = moment.isMoment(endTime) ? endTime.format() : endTime;
  startTime = moment.isMoment(startTime) ? startTime.format() : startTime;
  const serviceList = await db.Service.findAll({
    attributes: [[Sequelize.literal('"timeLength"+"cleanUpTime"'), 'time']],
    order: [[Sequelize.literal('"timeLength"+"cleanUpTime"'), 'ASC']],
    where: {
      healerProfileId,
    },
  });
  if (serviceList < 0) {
    throw new Error('Healer does not have any service');
  }
  const checkTimeList = serviceList.map((service) => {
    const serviceTime = service.dataValues.time;
    return {
      sessionTime: {
        [Op.between]: [
          moment(startTime).subtract(serviceTime, 'minutes').format(),
          endTime,
        ],
      },
      [Op.and]: Sequelize.where(
        Sequelize.literal('"sessionLength"+"cleanUpTime"'),
        '=',
        serviceTime
      ),
    };
  });

  const bookedSlotQueryResult = await db.Appointment.findAll({
    attributes: [
      'sessionTime',
      [Sequelize.literal('"sessionLength"+"cleanUpTime"'), 'timeLength'],
    ],
    where: {
      healerProfileId,
      [Op.and]: [
        {
          [Op.or]: [...checkTimeList],
        },
        {
          [Op.or]: [
            { status: PAID },
            {
              createdAt: {
                // within 1 hour
                [Op.between]: [
                  moment().subtract(15, 'minutes'),
                  moment().add(10, 'minutes'), // this is just the case some conflict saved,
                ],
              },
              status: BOOKED,
            },
          ],
        },
      ],
    },
  });
  const bookedSlots =
    bookedSlotQueryResult.length > 0
      ? bookedSlotQueryResult.map((slot) => slot.dataValues)
      : [];
  console.log(bookedSlots);
  return bookedSlots;
};

/**
 * @note this function does not throw error
 */
const getUserWithHealerProfile = async (uid) => {
  console.log('get user info');
  const user = await db.User.findOne({
    attributes: ['id', 'email'],
    where: {
      uid,
    },
    include: [
      {
        model: db.HealerProfile,
        as: 'account',
        attributes: ['id'],
      },
    ],
  });
  console.log('don user info');
  return user;
};

/**
 * get appointment info by appointment primary id
 * @return model query instance
 * @note only allow healer or client of appointment to get this info
 * @note need to check null result
 */
const getAppointmentInfoByPK = async (id) => {
  const appointment = await db.Appointment.findByPk(id);
  return appointment;
};

export default {
  findTimeSlot,
  generateDateList,
  getIntervalTime,
  getBookedSlots,
  getUserWithHealerProfile,
  getAppointmentInfoByPK,
};
