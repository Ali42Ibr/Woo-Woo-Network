import { Op } from 'sequelize';
import db from '../../general/models';
import getCommonDataHelper from '../../general/utils/get-common-data-helper';

const getHealerDaySchedule = async ({ date, healerProfileId, timezone }) => {
  const periodQueryResult = await db.HealerSchedule.findAll({
    attributes: ['startTime', 'endTime'],
    where: {
      healerProfileId,
      startTime: {
        [Op.between]: [
          getCommonDataHelper.getDefaultStartDateTime(date, timezone),
          getCommonDataHelper.getDefaultEndDateTime(date, timezone),
        ],
      },
    },
  });
  return periodQueryResult.map((period) => period.dataValues);
};

export default {
  getHealerDaySchedule,
};
