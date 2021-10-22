import db from '../general/models';
import jwtHelper from '../general/utils/jwt-helper';
import userHelper from './user-helper';

import { BadRequest } from '../general/middlewares/error-handle-middleware/error-code';

/**
 * @returns all the users in the database
 * @note may not need this function - mostly for testing purpose
 */
const getAllUsers = async (req, res, next) => {
  try {
    const userList = await db.User.findAll();
    res.status(200).json(userList);
  } catch (err) {
    next(err);
  }
};
/**
 * Get a user information (profile) based on user uid
 */
const getUser = async (req, res, next) => {
  try {
    //const uid = req.params.uid;
    const { healer, user_id: uid } = jwtHelper.getJWTInfo(
      req.headers['authorization']
    );
    if (healer) {
      // if user is healer
      const healerProfile = await userHelper.getHealerUser(uid);
      res.status(200).json(healerProfile);
    } else {
      const user = await userHelper.getUser(uid);
      user.photo = user.photo
        ? process.env.PHOTO_STORAGE_DOMAIN + user.photo
        : '';
      res.status(200).json(user);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Create new user
 */
const createUser = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, isHealer } = req.body;
    console.log(email);
    const uid = await userHelper.createAuthAccount({
      email,
      password,
      displayName: firstName,
      isHealer,
    });
    // save user account without password to database
    await userHelper.createUser(isHealer, {
      firstName,
      lastName,
      email,
      isHealer,
      uid,
    });

    res.status(201).send('User verification email has been sent');
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * Update user email
 * @note need to have user password to confirm this action
 */
const updateUserEmail = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id: uid, email } = jwtHelper.getJWTInfo(token);

    // get information
    const { password, email: updatedEmail } = req.body;
    // check duplicate data
    if (email == updatedEmail) {
      res.status(403).send('Same email in the system');
    } else {
      // update data
      const token = await userHelper.updateEmail({
        newEmail: updatedEmail,
        oldEmail: email,
        password,
      });
      await userHelper.updateUser({
        userInfo: {
          email: updatedEmail,
        },
        uid,
      });
      res.status(200).json({
        token,
      });
    }
  } catch (err) {
    next(err);
  }
};

/**
 * Update user password
 * @note need to send old password to confirm this action
 */
const updateUserPassword = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { email } = jwtHelper.getJWTInfo(token);
    // find usr email in jwt token
    const { oldPassword, newPassword } = req.body;
    console.log(oldPassword);

    await userHelper.updatePassword({
      oldPassword,
      newPassword,
      email,
    });
    res.status(200).send('The password has been updated successfully');
  } catch (err) {
    next(err);
  }
};

/**
 * Update user profile (non-sensitive info)
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    // extract some fields from request body
    const { password, email, ...profile } = req.body;

    await userHelper.updateUser({
      userInfo: {
        ...profile,
      },
      uid,
    });

    res.status(200).send('User profile has been updated successfully');
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateUserName = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    // extract some fields from request body
    const { firstName, lastName } = req.body;

    await userHelper.updateUser({
      userInfo: {
        firstName,
        lastName,
      },
      uid,
    });

    res.status(200).send('User profile has been updated successfully');
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateHealerProfile = async (req, res, next) => {
  try {
    const token = req.headers['authorization'];
    const { user_id: uid } = jwtHelper.getJWTInfo(token);
    // extract some fields from request body
    const { brandName, description, location, tags } = req.body;
    // update brandName and description
    await userHelper.updateHealerProfile({
      uid,
      updateValues: {
        brandName,
        description,
      },
      tags,
    });

    // update location if user want to update
    if (location) {
      await userHelper.updateUserLocation({
        uid,
        location,
      });
    }

    res.status(200).send('Healer profile has been updated successfully');
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/**
 * Update user profile photo
 */
const updateUserPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new BadRequest('No file exists');
    }
    const { user_id: uid } = jwtHelper.getJWTInfo(req.headers['authorization']);
    await userHelper.updateUser({
      userInfo: {
        photo: req.file.filename,
      },
      uid,
    });
    res
      .status(200)
      .send(`${process.env.PHOTO_STORAGE_DOMAIN}${req.file.filename}`);
  } catch (err) {
    next(err);
  }
};

const updateUserLocation = async (req, res, next) => {
  try {
    const { user_id: uid } = jwtHelper.getJWTInfo(req.headers['authorization']);
    const location = req.body;
    // set the default country is Canada
    if (location.country == null) {
      location.country = 'Canada';
    }
    await userHelper.updateUserLocation({
      uid,
      location,
    });
    res.status(200).send('Location has been updated');
  } catch (err) {
    next(err);
  }
};

// get healer payment account info
const getHealerPaymentForm = async (req, res, next) => {
  try {
    const { user_id: uid } = jwtHelper.getJWTInfo(req.headers['authorization']);
    // get healer paymentAccountId
    const healer = await db.HealerProfile.findOne({
      attributes: ['paymentAccountId'],
      include: {
        model: db.User,
        as: 'account',
        where: {
          uid,
        },
      },
    });
    const { paymentAccountId } = healer.dataValues;
    res.status(200).json({ url: paymentAccountId });
  } catch (err) {
    throw err;
  }
};

export default {
  getAllUsers,
  createUser,
  getUser,
  updateUserEmail,
  updateUserPassword,
  updateUserProfile,
  updateUserPhoto,
  updateUserLocation,
  updateHealerProfile,
  updateUserName,
  getHealerPaymentForm,
};
