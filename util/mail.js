const nodemailer = require("nodemailer");
var SibApiV3Sdk = require("sib-api-v3-sdk");

exports.generateOTP = (otp_length = 6) => {
  // generate 6 digit otp
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

exports.generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAIL_TRAP_USER,
      pass: process.env.MAIL_TRAP_PASS,
    },
  });

exports.sendEmail = async (name, email, subject, htmlContent) => {
  var defaultClient = SibApiV3Sdk.ApiClient.instance;

  // Configure API key authorization: api-key
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;

  // Uncomment below two lines to configure authorization using: partner-key
  // var partnerKey = defaultClient.authentications['partner-key'];
  // partnerKey.apiKey = 'YOUR API KEY';

  var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

  sendSmtpEmail = {
    to: [
      {
        email,
        name,
      },
    ],
    templateId: 59,
    subject: subject,
    htmlContent: htmlContent,
    sender: { name: "Movie Review App", email: process.env.OFFICIAL_EMAIL },
  };

  return await apiInstance.sendTransacEmail(sendSmtpEmail);
};
