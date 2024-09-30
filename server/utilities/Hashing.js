// hashing.js
// Hashing utility functions

const bcrypt = require('bcrypt');

// Number of salt rounds (complexity of the hash)
const saltRounds = 10;

// Hash the password
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

// Compare the password with the hash
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hashPassword,
    comparePassword
};