import express from 'express';
import serviceController from './service-controller';
import authMiddleware from '../general/middlewares/auth-middleware';

const serviceRouter = express.Router({ mergeParams: true });

serviceRouter
  .route('/')
  .get(serviceController.getHealerServiceList)
  .post(
    authMiddleware.isAuthenticatedHealer,
    serviceController.createHealerService
  );

serviceRouter
  .route('/:serviceId')
  .get(serviceController.getService)
  .put(
    authMiddleware.isAuthenticatedHealer,
    serviceController.updateHealerService
  )
  .delete(
    authMiddleware.isAuthenticatedHealer,
    serviceController.deleteHealerService
  );

export default serviceRouter;
