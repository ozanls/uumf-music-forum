// deleteUnconfirmedUsers.js
// This function deletes unconfirmed users that have not confirmed their email address within 1 hour of signing up.
// The purpose of this function is to prevent the database from filling up with unconfirmed accounts that are not being used.

const { Op } = require('sequelize');
const User = require('../models');

async function deleteUnconfirmedUsers() {
    const timeThreshold = new Date(new Date() - 60 * 60 * 1000); // 1 hour

    try {
        const result = await User.destroy({
            where: {
                confirmedEmail: false,
                createdAt: {
                    [Op.lt]: timeThreshold
                }
            }
        });

        if (result === 0) {
            console.log('No unconfirmed users found to delete.');
        } else {
            console.log('Unconfirmed accounts deleted.');
        }
    } catch (error) {
        console.error('Error deleting unconfirmed accounts:', error);
    }
}

module.exports = deleteUnconfirmedUsers;