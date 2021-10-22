import moment from 'moment-timezone';
import { Op } from 'sequelize';
import { NotFound } from '../../general/middlewares/error-handle-middleware/error-code';
import db from '../../general/models';
import getCommonDataHelper from '../../general/utils/get-common-data-helper';
import {
  REQUEST_CANCEL,
  REQUEST_RESCHEDULE,
} from '../../general/utils/appointment-status';
import appointmentSendEmailHelper, {
  EMAIL_CONTEXT_TYPE,
} from '../helpers/appointment-send-email-helper';

const requestCancelAppointment = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const healerProfileId = await getCommonDataHelper.getHealerProfileId(token);
    const { id: appointmentId } = req.params;
    const [updatedRow] = await db.Appointment.update(
      {
        healerRequest: REQUEST_CANCEL,
      },
      {
        where: {
          id: appointmentId,
          healerProfileId,
          sessionTime: {
            [Op.gte]: moment().format(),
          },
        },
        returning: true,
      }
    );
    if (updatedRow <= 0) {
      throw new NotFound();
    }

    // as we already check the appointmentId is valid, not need to check if appointmentInfo is null
    const appointmentInfo = await db.Appointment.findByPk(appointmentId);

    // send email to both client and healer
    await appointmentSendEmailHelper.sendEmailToClientHealer({
      appointmentInfo: appointmentInfo.dataValues,
      emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_REQUEST_CANCEL,
    });

    res.status(200).send('Request has been sent.');
  } catch (err) {
    next(err);
  }
};

const requestRescheduleAppointment = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const healerProfileId = await getCommonDataHelper.getHealerProfileId(token);
    const { id: appointmentId } = req.params;
    const { timezone, timeSlot, date } = req.body;
    const [updatedRow] = await db.Appointment.update(
      {
        healerRequest: REQUEST_RESCHEDULE,
      },
      {
        where: {
          id: appointmentId,
          healerProfileId,
          sessionTime: {
            [Op.gte]: moment().format(),
          },
        },
        returning: true,
      }
    );
    if (updatedRow <= 0) {
      throw new NotFound();
    }

    // as we already check the appointmentId is valid, not need to check if appointmentInfo is null
    const appointmentInfo = await db.Appointment.findByPk(appointmentId);

    // send email to both client and healer
    await appointmentSendEmailHelper.sendEmailToClientHealer({
      appointmentInfo: {
        ...appointmentInfo.dataValues,
        newSessionTime: moment
          .tz(`${date} ${timeSlot}`, timezone)
          .format('@h:mm a dddd, MMMM Do YYYY Z'),
      },
      emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_REQUEST_RESCHEDULE,
    });

    res.status(200).send('Request has been sent.');
  } catch (err) {
    next(err);
  }
};
export default {
  requestCancelAppointment,
  requestRescheduleAppointment,
};
