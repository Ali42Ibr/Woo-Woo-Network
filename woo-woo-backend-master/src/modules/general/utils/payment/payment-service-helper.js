import paymentService from './index.js';

export const initCheckout = async ({
  servicePrice,
  customerEmail,
  serviceName,
  serviceTimeLength,
  appointmentId,
  currency,
  healerPaymentId,
}) => {
  let session = null;
  try {
    session = await paymentService.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: serviceName,
              description: `${serviceName} for ${serviceTimeLength} minutes`,
              images: ['https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'],
            },
            unit_amount: Math.round(servicePrice * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        transfer_data: {
          destination: healerPaymentId, // will uncomment later on
        },
      },
      metadata: {
        appointmentId,
      },
      mode: 'payment',
      // should redirect to pay endpoint to save data payment
      success_url: `${process.env.APP_DOMAIN}`,
      cancel_url: `${process.env.APP_DOMAIN}`,
    });
  } catch (err) {
    // this is to handle if healer did not register payment account with stripe
    session = await paymentService.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: serviceName,
              description: `${serviceName} for ${serviceTimeLength} minutes`,
              images: ['https://i.imgur.com/EHyR2nP.png'],
            },
            unit_amount: Math.round(servicePrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        appointmentId,
      },
      mode: 'payment',
      // should redirect to pay endpoint to save data payment
      success_url: `${process.env.APP_DOMAIN}`,
      cancel_url: `${process.env.APP_DOMAIN}`,
    });
  }
  return session;
};

/**
 * @param amount - in dollar unit
 */
const refund = ({ amount, invoiceId, currency }) => {
  paymentService.refunds.create({
    amount: Math.round(amount * 100),
    payment_intent: invoiceId,
    currency,
  });
};

export default {
  initCheckout,
  refund,
};
