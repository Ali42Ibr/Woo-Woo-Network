import express from 'express';
import publicHealerProfileController from './public-healer-profile-controller';

const healerRouter = express.Router({ mergeParams: true });

healerRouter.get('/', publicHealerProfileController.getPublicHealerList);
healerRouter.post('/healerSearch', publicHealerProfileController.getHealerLocationList);

//publicHealerProfileController.getOtherHealerList
healerRouter
  .route('/:healerProfileId')
  .get(publicHealerProfileController.getPublicHealerProfile);

export default healerRouter;
