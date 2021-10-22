import { NotFound } from '../../general/middlewares/error-handle-middleware/error-code';
import db from '../../general/models';
import appointmentSendEmailHelper, {
  EMAIL_CONTEXT_TYPE,
} from '../helpers/appointment-send-email-helper';
import { PAID } from '../../general/utils/appointment-status';

// this is to accept payment webhook
const paymentSuccess = async (req, res, next) => {
  try {
    const event = req.body;
    switch (event.type) {
      case 'payment_intent.succeeded':
      case 'checkout.session.completed':
        const eventData = event.data.object;
        const { appointmentId } = eventData.metadata;
        // update data to database with the price total tax (not at this time)
        // update status to paid status
        const [updatedRow] = await db.Appointment.update(
          {
            status: PAID,
          },
          {
            where: {
              id: appointmentId,
            },
            returning: true,
          }
        );
        if (updatedRow < 0) {
          throw new NotFound();
        }
        // send email to both healer and client
        const appointmentInfo = await db.Appointment.findByPk(appointmentId);
        await appointmentSendEmailHelper.sendEmailToClientHealer({
          appointmentInfo: appointmentInfo.dataValues,
          emailContext: EMAIL_CONTEXT_TYPE.APPOINTMENT_BOOK,
        });
        break;
      default:
        throw new NotFound(`Unhandled event type ${event.type}`);
    }
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export default {
  paymentSuccess,
};
