import db from '../general/models';
import jwtHelper from '../general/utils/jwt-helper';
import userHelper from '../user/user-helper';

const getTagList = async (req, res, next) => {
  try {
    console.log(req);
    console.log("xd!");
    const { healer, user_id: uid } = jwtHelper.getJWTInfo(
      req.headers['authorization']
    );
    const healerProfile = await userHelper.getHealerUser(uid);
    console.log("hey");
    console.log(healerProfile);
    res.status(200).json((healerProfile.tags));
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const putTagList = async (req, res, next) => {

    console.log(req.body);
    console.log(123);

    const { healer, user_id: uid } = jwtHelper.getJWTInfo(
      req.headers['authorization']
    );
    const healerProfile = await userHelper.getHealerUser(uid);

    await db.HealerTag.destroy({
      where: {
        healerProfileId:healerProfile.id,
      },
    });

    for (let i = 0; i < req.body.length; i++){
    await db.HealerTag.create({
      healerProfileId: healerProfile.id,
      tagId: req.body[i]
    })
  };
    

};
export default {
  getTagList,
  putTagList
};
