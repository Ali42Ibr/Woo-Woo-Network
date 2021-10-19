import { NotFound } from '../../general/middlewares/error-handle-middleware/error-code';
import db from '../../general/models';
import emailTemplateId from '../../general/utils/send-email-helper/email-template-id';
import sendEmail from '../../general/utils/send-email-helper/send-email-helper';
import { Op, fn, col, literal, Sequelize } from 'sequelize';
import moment from 'moment';

const getHealerInfo = async (healerProfileId) => {
  const healerInfo = await db.HealerProfile.findOne({
    attributes: ['id', 'brandName'],
    include: {
      model: db.User,
      as: 'account',
      attributes: [
        // [fn('concat', col('firstName'), ' ', col('lastName')), 'name'],
        [Sequelize.literal(
          '"firstName" || " " || "lastName"'
        ), "name"],
        'email',
      ],
    },
    where: {
      id: healerProfileId,
    },
  });
  if (!healerInfo && !healerInfo.dataValues.account) {
    throw new NotFound('No healer found');
  }
  return {
    ...healerInfo.dataValues.account.dataValues,
    brandName: healerInfo.dataValues.brandName,
  };
};

const getClientInfo = async (clientId) => {
  const clientInfo = await db.User.findOne({
    attributes: [
      // [fn('concat', col('firstName'), ' ', col('lastName')), 'name'],
      [Sequelize.literal(
        '"firstName" || " " || "lastName"'
      ), "name"],
      'email',
      'firstName',
    ],
    where: {
      id: clientId,
    },
  });
  if (clientInfo == null) {
    throw new NotFound('No client found');
  }
  return clientInfo.dataValues;
};

/**
 * Contains template context info for both client and healer
 */
export const EMAIL_CONTEXT_TYPE = {
  APPOINTMENT_BOOK: {
    client: emailTemplateId.BOOK_SUCCESS_TO_CLIENT,
    healer: emailTemplateId.BOOK_SUCCESS_TO_HEALER,
  },
  APPOINTMENT_CANCEL: {
    client: emailTemplateId.APPOINTMENT_CANCEL_TO_CLIENT,
    healer: emailTemplateId.APPOINTMENT_CANCEL_TO_HEALER,
  },
  APPOINTMENT_RESCHEDULE: {
    client: emailTemplateId.APPOINTMENT_RESCHEDULE_TO_CLIENT,
    healer: emailTemplateId.APPOINTMENT_RESCHEDULE_TO_HEALER,
  },
  APPOINTMENT_REQUEST_RESCHEDULE: {
    client: emailTemplateId.APPOINTMENT_HEALER_REQUEST_RESCHEDULE_TO_CLIENT,
    healer: emailTemplateId.APPOINTMENT_HEALER_REQUEST_RESCHEDULE_TO_HEALER,
  },
  APPOINTMENT_REQUEST_CANCEL: {
    client: emailTemplateId.APPOINTMENT_HEALER_REQUEST_CANCEL_TO_CLIENT,
    healer: emailTemplateId.APPOINTMENT_HEALER_REQUEST_CANCEL_TO_HEALER,
  },
};

/**
 * @param contextType need to be a field in CONTEXT_TYPE
 * @param appointmentInfo should be a JS object (must have appointment primary id)
 */
const sendEmailToClientHealer = async ({ appointmentInfo, emailContext }) => {
  // get info from client and healer
  const client = await getClientInfo(appointmentInfo.clientId);
  const healer = await getHealerInfo(appointmentInfo.healerProfileId);
  console.log(healer);
  console.log(appointmentInfo);

  // send email to client
  await sendEmail({
    to: [{ email: client.email }],
    templateId: emailContext.client,
    params: {
      ...appointmentInfo,
      name: client.firstName,
      healerName: healer.name,
      healerBrand: healer.brandName,
      healerEmail: healer.email,
      sessionTime: moment(appointmentInfo.sessionTime).format(
        '@h:mm a dddd, MMMM Do YYYY Z'
      ),
      price: `$ ${appointmentInfo.price}`,
    },
  });

  // send email to healer
  await sendEmail({
    to: [{ email: healer.email }],
    templateId: emailContext.healer,
    params: {
      ...appointmentInfo,
      name: healer.name,
      clientName: client.name,
      clientEmail: client.email,
      sessionTime: moment(appointmentInfo.sessionTime).format(
        '@h:mm a dddd, MMMM Do YYYY Z'
      ),
      price: `$ ${appointmentInfo.price}`,
    },
  });
};

export default {
  sendEmailToClientHealer,
};
