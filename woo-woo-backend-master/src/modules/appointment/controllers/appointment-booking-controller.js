import moment from 'moment-timezone';
import {
  BadRequest,
  Forbidden,
  NotFound,
} from '../../general/middlewares/error-handle-middleware/error-code';
import db from '../../general/models';
import getCommonDataHelper from '../../general/utils/get-common-data-helper';
import jwtHelper from '../../general/utils/jwt-helper';
import appointmentHelper from '../helpers/appointment-get-info-helper';
import {
  BOOKED,
  CANCELED,
  PAID,
  REQUEST_CANCEL,
} from '../../general/utils/appointment-status';
import appointmentValidateHelper from '../helpers/appointment-validate-helper';
import appointmentScheduleHelper from '../helpers/appointment-schedule-helper';
import appointmentSendEmailHelper, {
  EMAIL_CONTEXT_TYPE,
} from '../helpers/appointment-send-email-helper';
import paymentServiceHelper from '../../general/utils/payment/payment-service-helper';

/**
 * @note may check if client can only book 1 week in advance or so
 */
const getHealerAvailableTimeSlots = async (req, res, next) => {
  try {
    // get startDate and endDate and timezone and healer profile id
    let { startDate, endDate, healer: healerProfileId, timezone } = req.query;
    // check the timezone
    timezone = timezone ? timezone : getCommonDataHelper.getDefaultTimezone();
    // validate data
    appointmentValidateHelper.validateFindAvailableSlotInput({
      startDate,
      endDate,
      timezone,
    });

    const intervalTime = await appointmentHelper.getIntervalTime(
      healerProfileId
    );
    const result = [];
    const dates = appointmentHelper.generateDateList({
      startDate,
      endDate,
    });
    // get periods list for each date
    // there's a async in the loop ==> do not use forEach
    for (let date of dates) {
      // check if startDate < now (may be 2-3 days) => do not query data
      if (moment.tz(date, timezone) < moment()) {
        result.push({
          date,
          availableSlots: [],
          bookedSlots: [],
        });
      } else {
        const workingPeriods =
          await appointmentScheduleHelper.getHealerDaySchedule({
            date,
            healerProfileId,
            timezone,
          });
        // get payed and booked (within 1 hour) appointment

        const timeSlotInDay = [];
        const bookSlotInDay = [];

        // calculate time slots
        for (let period of workingPeriods) {
          const { startTime, endTime } = period;
          const bookedSlots = await appointmentHelper.getBookedSlots({
            startTime,
            endTime,
            healerProfileId,
          });
          const availableSlots = appointmentHelper.findTimeSlot({
            start: startTime,
            end: endTime,
            intervalTime,
            blockTimeList: bookedSlots,
            timezone,
          });
          timeSlotInDay.push(...availableSlots);
          bookSlotInDay.push(...bookedSlots);
        }

        console.log("bookSlotInDay")
        console.log(bookSlotInDay)

        console.log("timeSlotInDay")
        console.log(timeSlotInDay)


        // format the result
        const dateFormat = moment(date).format('YYYY-MM-DD');
        result.push({
          date: dateFormat,
          availableSlots: timeSlotInDay,
          bookedSlots: bookSlotInDay,
        });
      }
    }

    // return back
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// book appointment
const bookAppointment = async (req, res, next) => {
  try {
    // get information
    const { healer: healerProfileId } = req.body;
    // get user id and check user is not healer they book
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    const user = await appointmentHelper.getUserWithHealerProfile(uid);
    if (user == null) {
      throw new Forbidden('User does not exist in the system');
    }
    // user can not book for themselves
    if (user.account && user.account.dataValues.id == healerProfileId) {
      throw new Forbidden('Can not book your own services');
    }
    // get date
    let { date, timeSlot, timezone, serviceId } = req.body;
    timezone = timezone ? timezone : getCommonDataHelper.getDefaultTimezone();
    // generate booked time
    const bookTime = moment.tz(`${date} ${timeSlot}`, timezone);
    // get service info
    if (!serviceId) {
      throw new BadRequest('Service is required');
    }
    const service = await db.Service.findOne({
      attributes: ['timeLength', 'cleanUpTime', 'price', 'id', 'name'],
      where: {
        id: serviceId,
        healerProfileId,
      },
    });
    if (service == null) {
      throw new BadRequest('Chosen service does not exist');
    }
    // get user input
    const {
      timeLength: serviceTimeLength,
      cleanUpTime: serviceCleanUpTime,
      price: servicePrice,
      name: serviceName,
    } = service.dataValues;

    timezone = timezone ? timezone : getCommonDataHelper.getDefaultTimezone();
    // validate booked session
    await appointmentValidateHelper.validateBookedSession({
      sessionTime: bookTime,
      serviceCleanUpTime,
      serviceTimeLength,
      healerProfileId,
    });

    const currency = await getCommonDataHelper.getHealerDefaultCurrency({
      healerProfileId,
    });

    // create new booked appointment
    const newBookSlot = await db.Appointment.create({
      healerProfileId,
      clientId: user.dataValues.id,
      sessionTime: bookTime,
      sessionLength: serviceTimeLength,
      serviceId,
      serviceName,
      price: servicePrice,
      status: BOOKED,
      cleanUpTime: serviceCleanUpTime,
      currency,
    });
    // get healer payment info
    const healerInfo = await db.HealerProfile.findByPk(healerProfileId);

    // create payment session
    const { url: paymentSessionUrl, payment_intent: invoiceId } =
      await paymentServiceHelper.initCheckout({
        servicePrice,
        serviceName,
        appointmentId: newBookSlot.dataValues.id,
        serviceTimeLength,
        customerEmail: user.dataValues.email,
        currency,
        healerPaymentId: healerInfo.dataValues.paymentAccountId,
      });
    // update bookedSlot with invoiceId (payment_intent)
    await newBookSlot.update({ invoiceId });

    // redirect to checkout page
    // front-end need to handle redirect status
    // res.redirect(303, paymentSessionUrl);
    res.status(200).send({
      appointmentId: newBookSlot.dataValues.id,
      checkoutUrl: paymentSessionUrl,
    });
  } catch (err) {
    next(err);
  }
};
// pay appointment (need to check with stripe to see)
// no longer need this ones
const payAppointment = async (req, res, next) => {
  try {
    const { id: appointmentId } = req.params;
    const token = req.headers['authorization'];
    const databaseUserId = await getCommonDataHelper.getUserId(token);

    const [updatedRow] = await db.Appointment.update(
      {
        status: PAID,
      },
      {
        where: {
          clientId: databaseUserId,
          id: appointmentId,
        },
        returning: true,
      }
    );
    if (updatedRow < 0) {
      throw new NotFound();
    }
    // get appointment info
    // as we already check the appointmentId is valid, not need to check if appointmentInfo is null
    const appointmentInfo = await db.Appointment.findByPk(appointmentId);

    // send email to both client and healer
    await appointmentSendEmailHelper.sendEmailToClientHealer({
      appointmentInfo: appointmentInfo.dataValues,
      emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_BOOK,
    });

    res.status(200).send('Appointment status is updated to paid');
  } catch (err) {
    next(err);
  }
};
/**
 * Re-schedule an appointment
 */
const rescheduleAppointment = async (req, res, next) => {
  try {
    const { id: appointmentId } = req.params;
    const token = req.headers['authorization'];
    const databaseUserId = await getCommonDataHelper.getUserId(token);
    // get appointment information
    const appointmentQueryResult = await db.Appointment.findOne({
      where: {
        clientId: databaseUserId,
        id: appointmentId,
      },
    });
    if (appointmentId == null) {
      throw new NotFound();
    }
    let { date: bookedDate, timeSlot: bookedTimeSlot, timezone } = req.body;
    timezone = timezone ? timezone : getCommonDataHelper.getDefaultTimezone();
    const bookedTime = moment.tz(`${bookedDate} ${bookedTimeSlot}`, timezone);
    const {
      sessionLength: serviceTimeLength,
      cleanUpTime: serviceCleanUpTime,
      healerProfileId,
    } = appointmentQueryResult.dataValues;
    // validate new session time
    await appointmentValidateHelper.validateBookedSession({
      sessionTime: bookedTime,
      serviceTimeLength,
      serviceCleanUpTime,
      healerProfileId,
    });
    // update appointment with new session time
    const [updatedRow] = await db.Appointment.update(
      {
        sessionTime: bookedTime,
      },
      {
        where: {
          clientId: databaseUserId,
          id: appointmentId,
          status: PAID,
        },
      }
    );
    if (updatedRow == 0) {
      throw new NotFound('Not found or not valid appointment to update');
    }

    // get appointment info
    // as we already check the appointmentId is valid, not need to check if appointmentInfo is null
    const appointmentInfo = await db.Appointment.findByPk(appointmentId);

    // send email to both client and healer
    await appointmentSendEmailHelper.sendEmailToClientHealer({
      appointmentInfo: appointmentInfo.dataValues,
      emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_RESCHEDULE,
    });
    res.status(200).send('Appointment has been re-scheduled');
  } catch (err) {
    next(err);
  }
};
/**
 * Cancel appointment
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { id: appointmentId } = req.params;
    const token = req.headers['authorization'];
    const databaseUserId = await getCommonDataHelper.getUserId(token);
    // find appointment
    const appointmentInfo = await db.Appointment.findOne({
      where: {
        clientId: databaseUserId,
        id: appointmentId,
      },
    });
    if (!appointmentInfo) {
      throw new NotFound('Do not found appointment');
    }
    const healerProfileId = appointmentInfo.healerProfileId;
    // check if have to apply minus fee
    const cancelFee = await db.CancelFee.findOne({
      where: {
        healerProfileId,
      },
    });

    const { price: servicePrice } = appointmentInfo.dataValues;

    let refundAmount = servicePrice;
    if (cancelFee) {
      const { sessionTime } = appointmentInfo.dataValues;
      const duration = moment
        .duration(moment(sessionTime).diff(moment()))
        .asDays();
      if (
        duration < cancelFee.dataValues.appliedDay &&
        appointmentInfo.dataValues.healerRequest !== REQUEST_CANCEL
      ) {
        // calculate the amount to charge the refund

        const { fee } = cancelFee.dataValues;
        //const taxPercentage = totalAmount / servicePrice;
        // remember total amount can be in cents unit
        // service price is in dollar unit => Math.round is okay
        refundAmount = servicePrice - fee;
      }
    }
    // get invoice id
    const { invoiceId } = appointmentInfo.dataValues;

    // refund with payment service
    paymentServiceHelper.refund({
      amount: refundAmount,
      invoiceId,
      currency: appointmentInfo.currency,
    });

    // get appointment invoice id, service price, total
    // request refund //https://stripe.com/docs/refunds
    // check if have to apply for cancel fee
    await appointmentInfo.update(
      {
        status: CANCELED,
      },
      {
        returning: true,
      }
    );

    // send email to both client and healer
    await appointmentSendEmailHelper.sendEmailToClientHealer({
      appointmentInfo: appointmentInfo.dataValues,
      emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_CANCEL,
    });
    res
      .status(200)
      .send(
        'The appointment has been canceled. You will receive the refund soon.'
      );
  } catch (err) {
    next(err);
  }
};

export default {
  getHealerAvailableTimeSlots,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
  payAppointment,
};
