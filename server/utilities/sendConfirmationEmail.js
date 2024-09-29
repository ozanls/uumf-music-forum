const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

const sesClient = new SESClient({ region: process.env.AWS_REGION });

const sendConfirmationEmail = async (user, token) => {
    const confirmationLink = `${process.env.SITE_URL}/users/confirm/${token}` || `http://localhost:${port}/users/confirm/${token}`;

    const params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [user.email]
        },
        Message: {
            Subject: {
                Data: 'UUMF - Confirm Your Email'
            },
            Body: {
                Text: {
                    Data: `Please confirm your email by clicking the following link: ${confirmationLink}. 
                    This link will expire in 1 hour.
                    If you did not request a password reset, please ignore this email.
                    (This is an automated message, please do not reply.)`
                }
            }
        }
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
        console.log('Confirmation email sent');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
};

module.exports = sendConfirmationEmail;