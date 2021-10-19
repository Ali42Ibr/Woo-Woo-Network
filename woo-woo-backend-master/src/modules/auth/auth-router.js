import express from 'express';
import authController from './auth-controller';

const authRouter = express.Router({ mergeParams: true });

authRouter.route('/login').post(authController.login);
// reset password request
authRouter
  .route('/reset-password')
  .post(authController.sendResetPasswordLink)
  .put(authController.resetPassword);

authRouter.get('/verify', authController.verifyActionLink);

export default authRouter;
