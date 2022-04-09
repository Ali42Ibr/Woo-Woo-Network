import express from 'express';

import userController from './user-controller';
import upload from '../general/middlewares/photo-upload-middleware';
import authMiddleware from '../general/middlewares/auth-middleware';

// user router
const userRouter = express.Router({ mergeParams: true });

userRouter
  .route('/')
  .get(authMiddleware.isAuthenticatedUser, userController.getUser)
  .post(userController.createUser)
  .put(authMiddleware.isAuthenticatedUser, userController.updateUserProfile);

userRouter
  .route('/email')
  .patch(authMiddleware.isAuthenticatedUser, userController.updateUserEmail);
userRouter
  .route('/password')
  .patch(authMiddleware.isAuthenticatedUser, userController.updateUserPassword);

userRouter
  .route('/name')
  .patch(authMiddleware.isAuthenticatedUser, userController.updateUserName);
userRouter
  .route('/photo')
  .patch(
    authMiddleware.isAuthenticatedUser,
    upload.single('photo'),
    userController.updateUserPhoto
  );
// update healer profile information
userRouter
  .route('/healerProfile')
  .put(
    authMiddleware.isAuthenticatedHealer,
    userController.updateHealerProfile
  );

userRouter
  .route('/location')
  .put(authMiddleware.isAuthenticatedUser, userController.updateUserLocation);

userRouter
  .route('/paymentAccountForm')
  .get(authMiddleware.isAuthenticatedUser, userController.getHealerPaymentForm);


export default userRouter;
