import SibApiV3Sdk from 'sib-api-v3-sdk';
// create email service client instance
const defaultClient = SibApiV3Sdk.ApiClient.instance;

// register with api key
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_SERVICE_API;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

/**
 * Send transactional emails
 * @params to: recipient email address, it should be: [{"email":"joe@example.com"}]
 * @params params: some custom data passed to email template, for example:  {"name":"Joe", text: msg}
 * @params attachment: file to attached to email (optional)
 * @params template to be used, should use constant value from email-template-id.js
 */
const sendEmail = async ({ to, params, attachment, templateId }) => {
  if (!to) {
    throw new Error('There is no recipient email address');
  }
  // value to send transactional api
  // const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
  //   to,
  //   params,
  //   attachment,
  //   templateId,
  // });
  // console.log(sendSmtpEmail);
  await apiInstance.sendTransacEmail({
    to,
    params,
    attachment,
    templateId,
  });
};

export default sendEmail;
