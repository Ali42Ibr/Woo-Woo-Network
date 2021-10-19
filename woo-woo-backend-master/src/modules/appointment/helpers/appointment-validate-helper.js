import moment from 'moment-timezone';
import { Op } from 'sequelize';
import db from '../../general/models';

import { BadRequest } from '../../general/middlewares/error-handle-middleware/error-code';
import appointmentHelper from './appointment-get-info-helper';

/**
 * @note Miss to validate timeSlots overlay the later part of booked session, but low risk
 */
const validateBookedSession = async ({
  sessionTime,
  serviceTimeLength,
  serviceCleanUpTime,
  healerProfileId,
}) => {
  // validate booked session
  const workingPeriod = await db.HealerSchedule.findOne({
    where: {
      healerProfileId,
      startTime: {
        [Op.lte]: sessionTime,
      },
      endTime: {
        [Op.gte]: moment(sessionTime).add(serviceTimeLength, 'minutes'),
      },
    },
  });
  if (workingPeriod == null) {
    throw new BadRequest('Chosen slot is not within healer working hour');
  }
  // is book session under healer booking period
  const previousBookedSlot = await appointmentHelper.getBookedSlots({
    startTime: sessionTime,
    endTime: moment(sessionTime).add(
      serviceTimeLength + serviceCleanUpTime,
      'minutes'
    ),
    healerProfileId,
  });
  if (previousBookedSlot.length > 0) {
    throw new BadRequest('Conflict with other booked slots');
  }
};

const validateFindAvailableSlotInput = ({ startDate, endDate, timezone }) => {
  const now = moment();
  if (moment.tz(endDate, timezone) < now) {
    throw new BadRequest('The endDate needs to be larger than now');
  }
  // check duration between startDate and endDate, it should be no more than 7
  const duration = moment.duration(moment(endDate).diff(startDate)).asDays();
  if (duration > 7) {
    throw new BadRequest('Can not get time slots for more than 7 days.');
  } else if (duration < 0) {
    throw new BadRequest('endDate can not less than startDate');
  }
};

export default {
  validateFindAvailableSlotInput,
  validateBookedSession,
};
