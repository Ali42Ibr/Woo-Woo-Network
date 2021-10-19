import jwtHelper from '../general/utils/jwt-helper';
import db from '../general/models';

const getHealerProfileId = async (token) => {
  const { user_id } = jwtHelper.getJWTInfo(token);
  console.log(user_id);
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
  if (healerProfile == null) {
    throw new NotFound();
  }
  return healerProfile.dataValues.id;
};
export default {
  getHealerProfileId,
};
