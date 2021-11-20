import express from 'express';
import adminPageController from './admin-page-controller';

// public healer profile controller for healer list and profile details
import publicHealerProfileController from '../public-healer-profile/public-healer-profile-controller';

// user controller for healer updating functionality
import userController from '../user/user-controller';
import authMiddleware from '../general/middlewares/auth-middleware';

const adminRouter = express.Router({ mergeParams: true });

//Display healer list
adminRouter.get('/', publicHealerProfileController.getPublicHealerList);

//Display healer profile
adminRouter
  .route('/:healerProfileId')
  .get(publicHealerProfileController.getPublicHealerProfile);

//Healer delete function
adminRouter.post('/healerDelete', adminPageController.deleteUser);

//Healer update function
adminRouter
  .route('/healerProfile')
  .put(
      authMiddleware.isAuthenticatedHealer,
      userController.updateHealerProfile
  );

export default adminRouter;