import express from 'express';
import reviewController from './review-controller';
import upload from '../general/middlewares/photo-upload-middleware';
import authMiddleware from '../general/middlewares/auth-middleware';

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(reviewController.getReviewList)
  .post(
    authMiddleware.isAuthenticatedUser,
    upload.single('photo'),
    reviewController.createReview
  );

reviewRouter
  .route('/:reviewId')
  .get(reviewController.getReview)
  .put(
    authMiddleware.isAuthenticatedUser,
    upload.single('photo'),
    reviewController.updateReview
  )
  .delete(authMiddleware.isAuthenticatedUser, reviewController.deleteReview);

export default reviewRouter;
