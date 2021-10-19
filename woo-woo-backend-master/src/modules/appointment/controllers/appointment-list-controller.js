import moment from 'moment-timezone';
import { Op, fn, col, literal, Sequelize } from 'sequelize';
import { Forbidden } from '../../general/middlewares/error-handle-middleware/error-code';
import db from '../../general/models';

import jwtHelper from '../../general/utils/jwt-helper';

import { PAID } from '../../general/utils/appointment-status';
import appointmentHelper from '../helpers/appointment-get-info-helper';
import getCommonDataHelper from '../../general/utils/get-common-data-helper';

/**
 * Note: Use fn(), the one commented out 
 * for deployment as it does not work for SQLite not PostgreSQL
 */

// get incoming appointment
const getUpComingAppointment = async (req, res, next) => {
  try {
    // get user id
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    const user = await appointmentHelper.getUserWithHealerProfile(uid);

    if (user == null) {
      throw new Forbidden('non-existing user in the system');
    }

    const { limit, offset } = req.query;
    // get upcoming appointment (have to use pagination)

    // get query params
    let { date, timezone } = req.query;

    let queryResult = [];
    if (date) {
      timezone = timezone ? timezone : getCommonDataHelper.getDefaultTimezone();
      queryResult = await db.Appointment.findAll({
        attributes: [
          'id',
          'sessionTime',
          'sessionLength',
          'cleanUpTime',
          'price',
          'serviceName',
          'clientId',
          'healerProfileId',
        ],
        where: {
          [Op.or]: [
            { clientId: user.dataValues.id },
            {
              healerProfileId: user.dataValues.account
                ? user.dataValues.account.id
                : null,
            },
          ],
          sessionTime: {
            [Op.gte]: moment().format(),
            [Op.between]: [
              moment.tz(`${date} 00:00`, timezone).format(),
              moment.tz(`${date} 23:59`, timezone).format(),
            ],
          },
          status: PAID,
        },
        include: [
          {
            model: db.User,
            as: 'client',
            attributes: [
              'id',
              [
                // fn(
                //   'concat',
                //   literal('"client"."firstName"'),
                //   ' ',
                //   literal('"client"."lastName"')
                // ),
                Sequelize.literal(
                  'client."firstName" || " " || client."lastName"'
                ),
                'name',
              ],
            ],
          },
          {
            model: db.HealerProfile,
            as: 'healer',
            attributes: ['id'],
            include: {
              model: db.User,
              as: 'account',
              attributes: [
                'id',
                [
                  // fn(
                  //   'concat',
                  //   col('"healer->account"."firstName"'),
                  //   ' ',
                  //   col('"healer->account"."lastName"')
                  // ),
                  Sequelize.literal(
                    '`healer->account`."firstName" || " " || `healer->account`."lastName"'
                  ),
                  'name',
                ],
              ],
            },
          },
        ],
        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        order: [['sessionTime', 'ASC']],
      });
    } else {
      queryResult = await db.Appointment.findAll({
        attributes: [
          'id',
          'sessionTime',
          'sessionLength',
          'cleanUpTime',
          'price',
          'serviceName',
          'clientId',
          'healerProfileId',
        ],
        where: {
          [Op.or]: [
            { clientId: user.dataValues.id },
            {
              healerProfileId: user.dataValues.account
                ? user.dataValues.account.id
                : null,
            },
          ],
          sessionTime: {
            [Op.gte]: moment().format(),
          },
          status: PAID,
        },
        include: [
          {
            model: db.User,
            as: 'client',
            attributes: [
              'id',
              [
                // fn(
                //   'concat',
                //   literal('"client"."firstName"'),
                //   ' ',
                //   literal('"client"."lastName"')
                // ),
                Sequelize.literal(
                  'client."firstName" || " " || client."lastName"'
                ),
                'name',
              ],
            ],
          },
          {
            model: db.HealerProfile,
            as: 'healer',
            attributes: ['id'],
            include: {
              model: db.User,
              as: 'account',
              attributes: [
                'id',
                [
                  // fn(
                  //   'concat',
                  //   col('"healer->account"."firstName"'),
                  //   ' ',
                  //   col('"healer->account"."lastName"')
                  // ),
                  Sequelize.literal(
                    '`healer->account`."firstName" || " " || `healer->account`."lastName"'
                  ),
                  'name',
                ],
              ],
            },
          },
          {
            model: db.Review,
            as: 'review',
            attributes: ['id'],
          },
        ],

        limit: limit ? limit : 10,
        offset: offset ? offset : 0,
        order: [['sessionTime', 'ASC']],
      });
    }

    const appointmentList = queryResult.map((appointment) => {
      const isClient = user.dataValues.id == appointment.dataValues.clientId;
      return {
        ...appointment.dataValues,
        client: undefined,
        healer: undefined,
        name: isClient
          ? appointment.healer.account.dataValues.name
          : appointment.healer.account.dataValues.name,
        isClient,
      };
    });
    res.status(200).json(appointmentList);
  } catch (err) {
    next(err);
  }
};
/**
 * get past appointment
 * @note - only return paid appointment, can update
 */
const getPastAppointment = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    const user = await appointmentHelper.getUserWithHealerProfile(uid);

    if (user == null) {
      throw new Forbidden('non-existing user in the system');
    }
    const { limit, offset } = req.query;
    // get upcoming appointment (have to use pagination)
    const queryResult = await db.Appointment.findAll({
      attributes: [
        'id',
        'sessionTime',
        'cleanUpTime',
        'sessionLength',
        'price',
        'serviceName',
        'clientId',
        'healerProfileId',
      ],
      where: {
        [Op.or]: [
          { clientId: user.dataValues.id },
          {
            healerProfileId: user.dataValues.account
              ? user.dataValues.account.id
              : null,
          },
        ],
        sessionTime: {
          [Op.lt]: moment().format(),
          // [Op.gte]: moment().format(), // just for testing purpose
        },
        status: PAID,
      },
      include: [
        {
          model: db.Review,
          as: 'review',
        },
        {
          model: db.User,
          as: 'client',
          attributes: [
            'id',
            [
              // fn(
              //   'concat',
              //   col('"client"."firstName"'),
              //   ' ',
              //   col('"client".lastName')
              // ),
              Sequelize.literal(
                'client."firstName" || " " || client."lastName"'
              ),
              'name',
            ],
          ],
        },
        {
          model: db.HealerProfile,
          as: 'healer',
          attributes: ['id'],
          include: {
            model: db.User,
            as: 'account',
            attributes: [
              'id',
              [
                // fn(
                //   'concat',
                //   col('"healer->account"."firstName"'),
                //   ' ',
                //   col('"healer->account"."lastName"')
                // ),
                Sequelize.literal(
                  '`healer->account`."firstName" || " " || `healer->account`."lastName"'
                ),
                'name',
              ],
            ],
          },
        },
      ],
      limit: limit ? limit : 10,
      offset: offset ? offset : 0,
    });
    const appointmentList = queryResult.map((appointment) => {
      const isClient = user.dataValues.id == appointment.dataValues.clientId;
      return {
        ...appointment.dataValues,
        client: undefined,
        healer: undefined,
        name: isClient
          ? appointment.healer.account.dataValues.name
          : appointment.healer.account.dataValues.name,
        isClient,
      };
    });
    res.status(200).json(appointmentList);
  } catch (err) {
    next(err);
  }
};

export default {
  getPastAppointment,
  getUpComingAppointment,
};
