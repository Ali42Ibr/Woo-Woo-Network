import db from '../general/models';
const { User, HealerProfile, Location } = db;
import {
  NotFound,
  Forbidden,
  BadRequest,
} from '../general/middlewares/error-handle-middleware/error-code';
import { auth } from '../general/utils/firebase/firebase';
import admin from '../general/utils/firebase/admin';
import { promiseWrapper } from './error-handler';
import capitalize from 'capitalize';
import healerPaymentHelper from '../general/utils/payment/healer-payment-helper';
import sendEmail from '../general/utils/send-email-helper/send-email-helper';
import emailTemplateId from '../general/utils/send-email-helper/email-template-id';

/**
 * Get common user information
 */
const getUser = async (uid) => {
  const user = await User.findOne({
    attributes: ['firstName', 'lastName', 'email', 'photo', 'id'],
    where: {
      uid,
    },
  });

  if (user === null) {
    throw new NotFound();
  }
  const result = user.dataValues;
  let location = await Location.findOne({
    attributes: ['address', 'city', 'province', 'postalCode', 'country'],
    where: {
      userId: result.id,
    },
  });
  result.location = location;
  result.photo = result.photo
    ? process.env.PHOTO_STORAGE_DOMAIN + result.photo
    : '';

  return result;
};

/**
 * Create an account on authentication tool. (Firebase auth)
 */
const createAuthAccount = async ({
  email,
  password,
  displayName,
  isHealer,
}) => {
  try {
    // may need to have some nicer way to do it.
    const user = await promiseWrapper(
      auth().createUserWithEmailAndPassword(email, password)
    );
    await user.user.updateProfile({
      displayName: capitalize(displayName),
    });
    const uid = user.user.uid;
    // claim user role
    await admin.auth().setCustomUserClaims(uid, {
      healer: isHealer ? true : false,
    });
    await user.user.sendEmailVerification();
    return uid;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Forbidden('Email already in use');
    } else if (err.code == 'auth/invalid-email') {
      throw new BadRequest('Invalid email');
    } else if (err.code == 'auth/weak-password') {
      throw new BadRequest('Password is not strong enough.');
    } else {
      console.log(err);
      throw new BadRequest();
    }
  }
};

/**
 * Get some extra information for healer user (like brand name, description)
 */
const getHealerUser = async (uid) => {
  const userInfo = await getUser(uid);
  const result = await db.HealerProfile.findOne({
    attributes: ['description', 'brandName', 'id'],
    where: {
      accountId: userInfo.id,
    },
    include: {
      model: db.Tag,
      as: 'tags',
      attributes: ['name'],
    },
  });
  if (result == null) {
    throw new NotFound();
  }

  return {
    healerProfileId: result.dataValues.id,
    ...userInfo,
    ...result.dataValues,
  };
};

/**
 * Create a new user (either healer or client)
 */
const createUser = async (isHealer, userInfo) => {
  try {
    userInfo.role = isHealer ? 'healer' : 'client';
    if (isHealer) {
      const user = await User.create(userInfo, {
        returning: true,
      });
      console.log("Healer? " + isHealer);
      const userEmail = userInfo.email;
      // create paymentAccount
      const paymentAccountId =
        await healerPaymentHelper.createHealerPaymentAccount({
          email: userEmail,
        });
      // get account link
      const paymentAccountLink = await healerPaymentHelper.createAccountLink(
        paymentAccountId
      );
      await HealerProfile.create({
        accountId: user.dataValues.id,
        paymentAccountId,
      });
      console.log(paymentAccountLink.url);
      // send email to healer
      await sendEmail({
        to: [
          {
            email: userEmail,
          },
        ],
        params: {
          name: user.dataValues.firstName,
          link: paymentAccountLink.url,
        },
        templateId: emailTemplateId.PAYOUT_FORM_TO_HEALER,
      });
    } else {
      await User.create(userInfo);
    }
  } catch (err) {
    console.log(err);
    throw new BadRequest('Invalid request data');
  }
};

/**
 * Update common user information (either healer or client)
 */
const updateUser = async ({ userInfo, uid }) => {
  // it has to return how many rows affected by this row
  const [rowCount] = await db.User.update(userInfo, {
    where: {
      uid: uid,
    },
    returning: true,
  });
  if (rowCount <= 0) {
    throw new NotFound();
  }
};

/**
 * Update healer profile (only used if user is healer)
 */
const updateHealerProfile = async ({ uid, updateValues, tags }) => {
  const user = await User.findOne({
    attributes: ['id'],
    where: {
      uid,
    },
  });
  if (user === null) {
    throw new NotFound();
  }
  const { id } = user.dataValues;
  await db.HealerProfile.update(
    {
      ...updateValues,
    },
    {
      where: {
        accountId: id,
      },
    }
  );
  // update tags
  if (tags && Array.isArray(tags)) {
    const healerProfile = await db.HealerProfile.findOne({
      where: {
        accountId: id,
      },
    });
    healerProfile.setTags(tags);
  }
};

/**
 * Update user email
 * @note need to provide old email and password to identify usre
 */
const updateEmail = async ({ oldEmail, newEmail, password }) => {
  try {
    await promiseWrapper(auth().signInWithEmailAndPassword(oldEmail, password));
    await promiseWrapper(auth().currentUser.updateEmail(newEmail));
    const token = await auth().currentUser.getIdToken();
    return token;
  } catch (err) {
    switch (err.code) {
      // password or email incorrect
      case 'auth/user-not-found':
        throw new NotFound();
      case 'auth/email-already-in-use':
        throw new Forbidden('email is already in used');
      default:
        throw new BadRequest('Invalid email or password');
    }
  }
};

/**
 * update user password
 */
const updatePassword = async ({ email, oldPassword, newPassword }) => {
  try {
    await promiseWrapper(auth().signInWithEmailAndPassword(email, oldPassword));
    await auth().currentUser.updatePassword(newPassword);
  } catch (err) {
    switch (err.code) {
      case 'auth/wrong-password':
        throw new BadRequest('Invalid Password');
      default:
        throw new BadRequest();
    }
  }
};

/**
 * Update user location. If user did not provide location info, create a new one
 */
const updateUserLocation = async ({ uid, location }) => {
  const user = await User.findOne({
    attributes: ['id'],
    where: {
      uid,
    },
  });
  if (user === null) {
    throw new NotFound();
  }
  const { id } = user.dataValues;
  // find location based on user id
  const savedLocation = await db.Location.findOne({
    where: {
      userId: id,
    },
  });
  // if user did not have location yet, create a new one
  if (savedLocation == null) {
    await db.Location.create({
      userId: id,
      ...location,
    });
  } else {
    // update location if user provided location before
    await db.Location.update(location, {
      where: {
        userId: id,
      },
    });
  }
};

export default {
  getUser,
  createUser,
  updateUser,
  getHealerUser,
  updateHealerProfile,
  createAuthAccount,
  updateEmail,
  updatePassword,
  updateUserLocation,
};
