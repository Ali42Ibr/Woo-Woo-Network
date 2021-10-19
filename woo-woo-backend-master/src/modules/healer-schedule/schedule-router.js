import express from 'express';
import authMiddleware from '../general/middlewares/auth-middleware';
import scheduleController from './schedule-controller';

const scheduleRouter = express.Router({ mergeParams: true });

// only healer an access thess endpoints
scheduleRouter
  .route('/')
  .get(authMiddleware.isAuthenticatedHealer, scheduleController.getSchedule)
  .post(
    authMiddleware.isAuthenticatedHealer,
    scheduleController.createOrUpdateSchedule
  )
  .delete(
    authMiddleware.isAuthenticatedHealer,
    scheduleController.deleteSchedule
  );

export default scheduleRouter;
