import { BadRequest } from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';
import cancelFeeHelper from './cancel-fee-helper';

const getCancelFee = async (req, res, next) => {
  try {
    // get healerProfileId based on healer token or healer id
    const { healer } = req.query;

    let healerProfileId;
    if (healer) {
      healerProfileId = healer;
    } else {
      const token = req.headers['authorization'];
      healerProfileId = await cancelFeeHelper.getHealerProfileId(token);
    }

    const cancelFee = await db.CancelFee.findOne({
      attributes: ['fee', 'appliedDay', 'healerProfileId'],
      where: {
        healerProfileId,
      },
    });
    res.status(200).json(cancelFee ? cancelFee : {});
  } catch (err) {
    next(err);
  }
};

const updateCancelFee = async (req, res, next) => {
  try {
    // get healerProfileId based on healer token
    const token = req.headers['authorization'];
    const healerProfileId = await cancelFeeHelper.getHealerProfileId(token);
    // get cancel Fee info
    const { fee, appliedDay } = req.body; // should have fee and appliedDay field
    // validate cancelFee
    // set services time (length and clean up time) -> get the smallest one
    const service = await db.Service.findAll({
      attributes: ['price'],
      order: [['price', 'ASC']],
      limit: 1,
      where: {
        healerProfileId,
      },
    });
    if (!service || service.length <= 0) {
      throw new BadRequest('Need to create a service before create cancel fee');
    }
    if (service[0].dataValues.price <= fee) {
      throw new BadRequest('Cancel fee can not be higher than service price.');
    }
    // find cancel fee
    const cancelFee = await db.CancelFee.findOne({
      where: {
        healerProfileId,
      },
    });
    if (cancelFee) {
      await cancelFee.update({
        fee,
        appliedDay,
      });
    } else {
      await db.CancelFee.create({
        healerProfileId,
        fee,
        appliedDay,
      });
    }

    res.status(200).send('Cancel fee has been updated');
  } catch (err) {
    next(err);
  }
};

export default {
  getCancelFee,
  updateCancelFee,
};
