import express from 'express';

import userRouter from './modules/user/user-router';
import healerRouter from './modules/public-healer-profile/public-healer-router';
import reviewRouter from './modules/review/review-router';
import authRouter from './modules/auth/auth-router';
import serviceRouter from './modules/healer-service/service-router';
import authMiddleware from './modules/general/middlewares/auth-middleware';
import tagRouter from './modules/tag/tag-router';
import diaryRouter from './modules/diary/diary-router';
import scheduleRouter from './modules/healer-schedule/schedule-router';
import cancelFeeRouter from './modules/cancel-fee/cancel-fee-router';
import appointmentRouter from './modules/appointment/appointment-router';
// admin page under development 
//import adminRouter from './modules/admin/admin-page-router';

const router = express.Router();

/* index router. */
router.get('/', authMiddleware.isAuthenticatedUser, (req, res) => {
  res.send('hello from Woo Woo Net');
});
// only /healers endpoint is public, not require jwt token
router.use('/healers', healerRouter);

// need to have isAuthenticated user
router.use('/users', userRouter);
// auth router does not need to have jwt token
router.use('/auth', authRouter);

// review endpoint need to have jwt token
router.use('/reviews', reviewRouter);
// service endpoint need to have jwt token
router.use('/services', serviceRouter);

router.use('/schedules', scheduleRouter);

router.use('/tags', tagRouter);

router.use('/diaries', diaryRouter);

router.use('/cancel-fee', cancelFeeRouter);

router.use('/appointments', appointmentRouter);

// router.use('/admin', adminRouter);

export default router;
