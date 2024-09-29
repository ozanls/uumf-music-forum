const { Op } = require('sequelize');
const User = require('./models/User');

async function deleteUnconfirmedUsers() {
    const timeThreshold = new Date(new Date() - 60 * 60 * 1000);

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