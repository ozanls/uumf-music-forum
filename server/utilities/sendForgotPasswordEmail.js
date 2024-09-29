const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

const sesClient = new SESClient({ region: process.env.AWS_REGION });

const sendForgotPasswordEmail = async (user, token) => {
    const confirmationLink = `${process.env.SITE_URL}/users/reset-password/${token}` || `http://localhost:${port}/reset-password/reset-password/${token}`;
    
    // REPLACE confirmationLink with frontend URL that sends a POST request to the reset-password route.

    const params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [user.email]
        },
        Message: {
            Subject: {
                Data: 'UUMF - Reset Your Password'
            },
            Body: {
                Text: {
                    Data: `You can reset your password using the following link: ${confirmationLink}. 
                    This link will expire in 1 hour.
                    If you did not request a password reset, please ignore this email.
                    (This is an automated message, please do not reply.)`
                }
            }
        }
    };

    try {
        await sesClient.send(new SendEmailCommand(params));
        console.log('Password reset email sent');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};

module.exports = sendForgotPasswordEmail;