import { BadRequest } from '../../general/middlewares/error-handle-middleware/error-code';
import { auth } from '../../general/utils/firebase/firebase';
import { adminAuth } from '../../general/utils/firebase/admin';
import { promiseWrapper } from './error-handler';

/**
 * Verify user email. May not need since firebase will handle it
 */
const handleVerifyEmail = async (oobCode) => {
  try {
    await auth().applyActionCode(oobCode);
    return true;
  } catch (err) {
    return false;
  }
};
/**
 * May not needed since firebase will handle it
 */
const handleVerifyResetPasswordLink = async (oobCode) => {
  try {
    await auth().verifyPasswordResetCode(oobCode);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Get session token for login user
 */
const getToken = async (email, password) => {
  try {
    await promiseWrapper(auth().signInWithEmailAndPassword(email, password));
    let token = await auth().currentUser.getIdToken();

    return token;
  } catch (err) {
    //console.log(err);
    throw new BadRequest('Invalid email or password');
  }
};

/**
 * Send a link to user email to reset password
 */
const sendResetPasswordLink = async (email) => {
  // having a bugs -> set a time out r need to check email formation
  await promiseWrapper(auth().sendPasswordResetEmail(email));
};

/**
 * May not need since firebase will handle it
 */
const resetPassword = async (resetCode, password) => {
  await promiseWrapper(auth().confirmPasswordReset(resetCode, password));
};

export default {
  handleVerifyEmail,
  handleVerifyResetPasswordLink,
  getToken,
  sendResetPasswordLink,
  resetPassword,
};
