import express from 'express';
import authMiddleware from '../general/middlewares/auth-middleware';
import diaryController from './diary-controller';

const diaryRouter = express.Router({ mergeParams: true });

diaryRouter
  .route('/')
  .get(authMiddleware.isAuthenticatedUser, diaryController.getDiaryByDate)
  .post(
    authMiddleware.isAuthenticatedUser,
    diaryController.createOrUpdateDiary
  );

export default diaryRouter;
