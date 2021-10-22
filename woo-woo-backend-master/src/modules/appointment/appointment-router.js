import express from 'express';
import appointmentBookingController from './controllers/appointment-booking-controller';
import appointmentHealerRequestController from './controllers/appointment-healer-request-controller';
import appointmentListController from './controllers/appointment-list-controller';
import appointmentWebhookController from './controllers/appointment-webhook-controller';
import authMiddleware from '../general/middlewares/auth-middleware';

/**
 * The to have following endpoints
 * 1. Get available time slot
 * 2. Book appointment
 * 3. Pay appointment
 * 4. Re-schedule appointment
 * 5. cancel appointment
 * 6. healer request client and change their schedule
 * 7. Healer request client cancel their schedule (at this time, do not apply cancel fee)
 * 8. Incoming appointment
 * 9. Past appointment
 */

const appointmentRouter = express.Router({ mergeParams: true });

appointmentRouter
  .route('/available')
  .get(appointmentBookingController.getHealerAvailableTimeSlots);
// need to add authentication later on (after testing)
appointmentRouter
  .route('/book')
  .post(
    authMiddleware.isAuthenticatedUser,
    appointmentBookingController.bookAppointment
  );
// it may contain some sensitive info may change after working with stripe
appointmentRouter
  .route('/:id/pay')
  .post(authMiddleware.isAuthenticatedUser, appointmentBookingController.payAppointment);
appointmentRouter
  .route('/payment-success')
  .post(appointmentWebhookController.paymentSuccess);
appointmentRouter
  .route('/:id/reschedule')
  .post(
    authMiddleware.isAuthenticatedUser,
    appointmentBookingController.rescheduleAppointment
  );
// it may contain some sensitive info -> post (may change after working with stripe)
appointmentRouter
  .route('/:id/cancel')
  .get(
    authMiddleware.isAuthenticatedUser,
    appointmentBookingController.cancelAppointment
  );
appointmentRouter
  .route('/upcoming')
  .get(
    authMiddleware.isAuthenticatedUser,
    appointmentListController.getUpComingAppointment
  );
appointmentRouter
  .route('/history')
  .get(
    authMiddleware.isAuthenticatedUser,
    appointmentListController.getPastAppointment
  );

// healer request to client
appointmentRouter
  .route('/:id/request/cancel')
  .get(
    authMiddleware.isAuthenticatedHealer,
    appointmentHealerRequestController.requestCancelAppointment
  );
appointmentRouter
  .route('/:id/request/reschedule')
  .post(
    authMiddleware.isAuthenticatedHealer,
    appointmentHealerRequestController.requestRescheduleAppointment
  );
export default appointmentRouter;
