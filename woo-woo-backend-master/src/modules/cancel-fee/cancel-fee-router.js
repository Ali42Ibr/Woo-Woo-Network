import express from 'express';
import authMiddleware from '../general/middlewares/auth-middleware';
import cancelFeeController from './cancel-fee-controller';

const cancelFeeRouter = express.Router({ mergeParams: true });

cancelFeeRouter
  .route('/')
  .get(cancelFeeController.getCancelFee)
  .post(
    authMiddleware.isAuthenticatedHealer,
    cancelFeeController.updateCancelFee
  );

export default cancelFeeRouter;
