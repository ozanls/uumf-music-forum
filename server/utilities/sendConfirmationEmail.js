const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

const sesClient = new SESClient({ region: process.env.AWS_REGION });

const sendConfirmationEmail = async (user, token) => {
    const confirmationLink = `http://localhost:3001/users/confirm/${token}`;

    const params = {
        Source: process.env.AWS_SES_SENDER,
        Destination: {
            ToAddresses: [user.email]
        },
        Message: {
            Subject: {
                Data: 'Email Confirmation'
            },
            Body: {
                Text: {
                    Data: `Please confirm your email by clicking the following link: ${confirmationLink}`
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