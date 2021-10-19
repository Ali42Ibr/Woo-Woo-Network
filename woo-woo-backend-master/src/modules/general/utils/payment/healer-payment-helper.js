import paymentService from '.';
import { BadRequest } from '../../middlewares/error-handle-middleware/error-code';

/**
 * @return account id
 */
const createHealerPaymentAccount = async ({ email }) => {
  try {
    // register connect account to stripe for healer to get paid
    const account = await paymentService.accounts.create({
      type: 'standard',
    });
    return account.id;
  } catch (err) {
    throw new BadRequest(err.message);
  }
};

/**
 *  @return - accountLink object with url - connect to stripe, expired time and created time
 */
const createAccountLink = async (accountId) => {
  try {
    const accountLink = await paymentService.accountLinks.create({
      account: accountId,
      refresh_url: process.env.APP_DOMAIN, // maybe home page
      return_url: process.env.APP_DOMAIN, // maybe home page
      type: 'account_onboarding',
    });
    return accountLink;
  } catch (err) {
    throw new BadRequest(err.message);
  }
};

export default {
  createHealerPaymentAccount,
  createAccountLink,
};
