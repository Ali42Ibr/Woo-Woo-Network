import moment from 'moment-timezone';
import { NotFound } from '../middlewares/error-handle-middleware/error-code';
import db from '../models';
import jwtHelper from './jwt-helper';

/**
 * They are some common data used across the system,
 * if have more time, will refactor early code to use them instead of it's own implementation
 */

/**
 * Get default timezone, make the system's independent from machine timezone
 */
const getDefaultTimezone = () => {
  return 'America/Los_Angeles';
};

/**
 * @note if healer's not found, it will throw not found err
 */
const getHealerProfileId = async (token) => {
  const { user_id: uid } = jwtHelper.getJWTInfo(token);
  const healerProfile = await db.HealerProfile.findOne({
    attributes: ['id'],
    include: {
      model: db.User,
      as: 'account',
      where: {
        uid,
      },
    },
  });
  if (healerProfile == null) {
    throw new NotFound();
  }
  return healerProfile.dataValues.id;
};

/**
 * Get the currency from user profile based on healerProfileId or current user token (if user is a healer)
 * */
const getHealerDefaultCurrency = async ({ token, healerProfileId }) => {
  let healerProfile;
  if (token) {
    healerProfile = await db.HealerProfile.findOne({
      attributes: ['currency'],
      include: {
        model: db.User,
        as: 'account',
        where: {
          uid: user_id,
        },
      },
    });
  } else {
    healerProfile = await db.HealerProfile.findOne({
      attributes: ['currency'],
      where: {
        id: healerProfileId,
      },
    });
  }

  if (healerProfile == null) {
    throw new NotFound();
  }
  return healerProfile.dataValues.currency;
};

/**
 * @note if user's not found , it will throw not found err
 */
const getUserId = async (token) => {
  const { user_id } = jwtHelper.getJWTInfo(token);
  const user = await db.User.findOne({
    where: {
      uid: user_id,
    },
  });
  if (user == null) {
    throw new NotFound();
  }
  return user.dataValues.id;
};

const getDefaultStartDateTime = (date, timezone) => {
  return moment.tz(`${date} 00:00`, timezone).format();
};

const getDefaultEndDateTime = (date, timezone) => {
  return moment.tz(`${date} 23:59`, timezone).format();
};

export default {
  getUserId,
  getDefaultTimezone,
  getHealerProfileId,
  getDefaultStartDateTime,
  getDefaultEndDateTime,
  getHealerDefaultCurrency,
};
