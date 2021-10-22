import { BadRequest } from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';
import moment from 'moment-timezone';
import scheduleHelper from './schedule-helper';
import { Op } from 'sequelize';

/**
 * Save healer, the added schedule has to be saved before 7 days from current time
 * @note date format need to be yyyy-mm-dd
 * @note time format need to be HH:mm (24h format)
 */
const createOrUpdateSchedule = async (req, res, next) => {
  try {
    // get healer profile id
    const token = req.headers['authorization'];
    const healerProfileId = await scheduleHelper.getHealerProfileId(token);
    let { timezone, schedules } = req.body;
    // check if timezone exist, otherwise get default timezone
    timezone = timezone ? timezone : scheduleHelper.getDefaultTimezone(); // need to have constrain for this
    // limit the saving days due to performance impact
    if (schedules.length > 7) {
      throw new BadRequest('Can only save 7 days');
    }
    // sort array based on date before processing
    schedules.sort((first, second) => {
      return scheduleHelper.sortDateAsc(first.date, second.date);
    });
    for (let dateSchedule of schedules) {
      const { periods, date } = dateSchedule;
      // check if the period is less than 3 (due to performance and management impact)
      if (periods.length > 3) {
        throw new BadRequest('Can not have more than 3 periods per day');
      }
      // check if the date is equal or more than 1 week
      const duration = moment
        .duration(moment.tz(date, timezone).diff(moment()))
        .asDays();
      if (duration < 7) {
        throw new BadRequest('Can not update schedule within one week');
      }

      // check if some client book under update schedule
      // may need to check more details for some conflicts
      await scheduleHelper.checkBookedAppointment({
        startTime: scheduleHelper.getDefaultStartDateTime(date, timezone),
        endTime: scheduleHelper.getDefaultEndDateTime(date, timezone),
        healerProfileId,
      });
      // may check if updating periods has conflicts with booked/payed appointment

      // destroy before updating
      await db.HealerSchedule.destroy({
        where: {
          healerProfileId,
          startTime: {
            [Op.between]: [
              scheduleHelper.getDefaultStartDateTime(date, timezone),
              scheduleHelper.getDefaultEndDateTime(date, timezone),
            ],
          },
        },
      });

      // save schedule periods
      for (let period of periods) {
        const { startTime, endTime } = period;
        const generatedStartTime = moment.tz(`${date} ${startTime}`, timezone);
        const generatedEndTime = moment.tz(`${date} ${endTime}`, timezone);
        // before saving need to destroy previous schedule
        await db.HealerSchedule.create({
          healerProfileId,
          startTime: generatedStartTime,
          endTime: generatedEndTime,
        });
      }
    }
    const result = await db.HealerSchedule.findAll();
    console.log(result);
    res.status(200).json('Schedule has been saved.');
  } catch (err) {
    next(new BadRequest(err.message));
  }
};

/**
 * Get schedule periods from given dates
 * @note Date format should be yyyy-mm-dd
 */
const getSchedule = async (req, res, next) => {
  try {
    // get healer profile id
    const token = req.headers['authorization'];
    const healerProfileId = await scheduleHelper.getHealerProfileId(token);
    // get the data
    let { timezone, startDate, endDate } = req.query;
    if (!startDate && !endDate) {
      throw new BadRequest('Missing startDate and endDate');
    }
    // limit maximum 7 days request , because more days, it will take longer time to process
    const duration = moment.duration(moment(endDate).diff(startDate)).asDays();
    if (duration > 7) {
      throw new BadRequest('Can not get schedule more than 7 days');
    } else if (duration < 0) {
      throw new BadRequest('endDate can not less than startDate');
    }

    timezone = timezone ? timezone : scheduleHelper.getDefaultTimezone();
    // generate dates
    const dates = [startDate];
    for (let i = 1; i <= duration; i++) {
      dates.push(moment(startDate).add(i, 'days').format('YYYY-MM-DD'));
    }
    const result = [];
    console.log(dates);
    // loop the date to get time slot for each date
    for (let date of dates) {
      const scheduleQueryResult = await db.HealerSchedule.findAll({
        attributes: ['startTime', 'endTime'],
        where: {
          healerProfileId,
          startTime: {
            [Op.gte]: scheduleHelper.getDefaultStartDateTime(date, timezone),
          },
          endTime: {
            [Op.lte]: scheduleHelper.getDefaultEndDateTime(date, timezone),
          },
        },
      });
      // format the result form the query response
      const periodList = [];
      for (let dateResult of scheduleQueryResult) {
        const period = {
          startTime: scheduleHelper.getTimeString(
            dateResult.dataValues.startTime,
            timezone
          ),
          endTime: scheduleHelper.getTimeString(
            dateResult.dataValues.endTime,
            timezone
          ),
        };
        periodList.push(period);
      }
      result.push({
        date: date,
        periods: periodList,
      });
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete schedule periods from given dates
 * @note Date format should be yyyy-mm-dd
 */
const deleteSchedule = async (req, res, next) => {
  try {
    // get healer profile id
    const token = req.headers['authorization'];
    const healerProfileId = await scheduleHelper.getHealerProfileId(token);
    let { timezone, startDate, endDate } = req.body;

    // validate startDate and endDate
    const duration = moment.duration(moment(endDate).diff(startDate)).asDays();
    console.log(duration);
    if (duration > 7) {
      throw new BadRequest('Can not get schedule more than 7 days');
    } else if (duration < 0) {
      throw new BadRequest('endDate can not less than startDate');
    }

    timezone = timezone ? timezone : scheduleHelper.getDefaultTimezone();
    const startTime = scheduleHelper.getDefaultStartDateTime(
      startDate,
      timezone
    );
    const endTime = scheduleHelper.getDefaultEndDateTime(endDate, timezone);

    // check if some clients booking during this time
    await scheduleHelper.checkBookedAppointment({
      startTime,
      endTime,
      healerProfileId,
    });

    await db.HealerSchedule.destroy({
      where: {
        healerProfileId,
        startTime: {
          [Op.between]: [startTime, endTime],
        },
      },
    });

    res.status(204).send('selected schedule has been deleted');
  } catch (err) {
    next(err);
  }
};

export default {
  createOrUpdateSchedule,
  getSchedule,
  deleteSchedule,
};
