import AWS from "aws-sdk"
import properties from "../config/properties.js"

// Configure AWS SES
AWS.config.update({
  accessKeyId: properties?.AWS_ACCESS_KEY_ID,  // Your AWS access key
  secretAccessKey: properties?.AWS_SECRET_ACCESS_KEY, // Your AWS secret key
  region: properties?.AWS_REGION
});

const ses = new AWS.SES();

export const sendEmail = async (toEmail, subject, bodyText, bodyHtml) => {
  const params = {
    Source: properties?.AWS_SENDER_EMAIL, // Verified sender email in SES
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: bodyText, // Dynamic plain text
        },
        Html: {
          Data: bodyHtml, // Dynamic HTML
        },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
