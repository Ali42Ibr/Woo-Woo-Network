import { NotFound } from '../general/middlewares/error-handle-middleware/error-code';
import db from '../general/models';

/**
 * Get a list of healer profile information
 */
const getHealerList = async (limit, start) => {
  let result = [];

  if (limit) {
    result = await db.HealerProfile.findAll({
      attributes: ['id', 'description', 'brandName'],
      include: [
        {
          model: db.User,
          as: 'account',
          attributes: ['firstName', 'lastName', 'photo'],
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
        },
      ],
      offset: start ? start : 0,
      limit: limit ? limit : 10,
    });
  } else {
    result = await db.HealerProfile.findAll({
      attributes: ['id', 'description', 'brandName'],
      include: [
        {
          model: db.User,
          as: 'account',
          attributes: ['firstName', 'lastName', 'photo'],
        },
        {
          model: db.Tag,
          as: 'tags',
          attributes: ['id', 'name'],
        },
      ],
    });
  }
  // format result data
  const healerList = result.map((healer) => {
    const { account, ...profile } = healer.dataValues;
    const { ...accountData } = account.dataValues;
    accountData.photo = accountData.photo
      ? process.env.PHOTO_STORAGE_DOMAIN + accountData.photo
      : '';
    return {
      ...profile,
      ...accountData,
    };
  });

  for (var i = 0; i < healerList.length; i++){
    if (healerList[i].tags.length < 1){
    healerList[i].tags[0] = '';
    }
  }
  console.log(healerList);
  return healerList;
};

/**
 * Get healer profile information based on healer profile id
 */
const getHealerProfile = async (id) => {
  const result = await db.HealerProfile.findOne({
    attributes: ['id', 'description', 'brandName'],
    where: {
      id,
    },
    include: [
      {
        model: db.User,
        as: 'account',
        attributes: ['firstName', 'lastName', 'photo', 'email', 'id'],
      },
      {
        model: db.Tag,
        as: 'tags',
        attributes: ['id', 'name'],
      },
    ],
  });
  if (result == null) {
    throw new NotFound();
  }
  // format query data
  const { account, ...profile } = result.dataValues;
  const { ...accountData } = account.dataValues;
  accountData.photo = accountData.photo
    ? process.env.PHOTO_STORAGE_DOMAIN + accountData.photo
    : '';
  // get location information based on accountData id
  const location = await db.Location.findOne({
    attributes: ['address', 'city', 'province', 'country', 'postalCode'],
    where: {
      userId: accountData.id,
    },
  });
  const healerProfile = {
    ...profile,
    ...accountData,
    location: location ? location.dataValues : null,
  };
  return healerProfile;
};

export default {
  getHealerList,
  getHealerProfile,
};
