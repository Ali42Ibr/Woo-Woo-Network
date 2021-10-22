import {
  Forbidden,
  NotFound,
} from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';
import jwtHelper from '../general/utils/jwt-helper';
import getCommonDataHelper from '../general/utils/get-common-data-helper';

/**
 * Get a list services based healerProfileId
 */
const getHealerServiceList = async (req, res, next) => {
  try {
    let { healer: healerProfileId } = req.query;
    if (!healerProfileId) {
      const token = req.headers['authorization'];
      healerProfileId = await getCommonDataHelper.getHealerProfileId(token);
    }
    const healerServiceList = await db.Service.findAll({
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'healerProfileId',
        'timeLength',
        'cleanUpTime',
        'isAvailableOnline',
      ],
      where: {
        healerProfileId,
      },
    });

    const currency = await getCommonDataHelper.getHealerDefaultCurrency({
      healerProfileId,
    });
    if (healerServiceList.length === 0) {
      res.status(200).json([]);
    } else {
      const serviceList = healerServiceList.map((service) => {
        return {
          ...service.dataValues,
          currency,
        };
      });
      res.status(200).json(serviceList);
    }
  } catch (err) {
    next(err);
  }
};

const getService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await db.Service.findOne({
      attributes: [
        'id',
        'name',
        'description',
        'price',
        'healerProfileId',
        'timeLength',
        'cleanUpTime',
        'isAvailableOnline',
      ],
      where: {
        id: serviceId,
      },
    });
    if (service == null) {
      throw new NotFound();
    }
    const currency = await getCommonDataHelper.getHealerDefaultCurrency({
      healerProfileId: service.dataValues.healerProfileId,
    });

    res.status(200).json({
      ...service.dataValues,
      currency,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Create a healing service
 */
const createHealerService = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const serviceInfo = req.body;
    const healerProfile = await db.HealerProfile.findOne({
      attributes: ['id'],
      include: {
        model: db.User,
        as: 'account',
        where: {
          uid: user_id,
        },
      },
    });
    const newService = await db.Service.create({
      ...serviceInfo,
      healerProfileId: healerProfile.dataValues.id,
    });
    res.status(201).json(newService);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a healer service
 */
const updateHealerService = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const { serviceId } = req.params;
    const serviceInfo = req.body;
    // get healer profile id
    const healerProfile = await db.HealerProfile.findOne({
      attributes: ['id'],
      include: {
        model: db.User,
        as: 'account',
        where: {
          uid: user_id,
        },
      },
    });
    // throw error if user is not healer
    if (healerProfile == null) {
      throw new Forbidden('Only healer can update services');
    }
    const updateValue = {};
    // check which data to update (filter null and undefined data)
    for (let prop in serviceInfo) {
      const value = serviceInfo[prop];
      if (value != null && value != undefined) {
        updateValue[prop] = value;
      }
    }
    // update service
    const [updateRow] = await db.Service.update(updateValue, {
      where: {
        healerProfileId: healerProfile.dataValues.id,
        id: serviceId,
      },
      returning: true,
    });
    // throw not found error if no row is updated (the service is not owned by this healer)
    if (updateRow <= 0) throw new NotFound();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

const deleteHealerService = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id } = jwtHelper.getJWTInfo(token);
    const { serviceId } = req.params;
    // get healer profile id
    const healerProfile = await db.HealerProfile.findOne({
      attributes: ['id'],
      include: {
        model: db.User,
        as: 'account',
        where: {
          uid: user_id,
        },
      },
    });
    // throw error if user is not healer
    if (healerProfile == null) {
      throw new Forbidden('Only healer access this endpoint');
    }
    // update service
    const deleteRow = await db.Service.destroy({
      where: {
        healerProfileId: healerProfile.dataValues.id,
        id: serviceId,
      },
      returning: true,
    });
    // throw not found error if no row is updated (the service is not owned by this healer)
    if (deleteRow <= 0) throw new NotFound();
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default {
  getHealerServiceList,
  createHealerService,
  updateHealerService,
  deleteHealerService,
  getService,
};
