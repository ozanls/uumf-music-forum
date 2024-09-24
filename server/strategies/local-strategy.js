const passport = require('passport');
const { Strategy } = require('passport-local');
const { User } = require('../models');
const { comparePassword } = require('../utilities/Hashing');

passport.serializeUser((user, done) => {
    console.log('1. serializeUser')
    done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
    console.log('2. deserializeUser')
    try{
        const findUser = await User.findOne({ where: { id } });
        if (!findUser) {
            throw new Error('User not found');
        }
        return done(null, findUser);
    } catch (error) {
        return done(error, null);
    }
})

passport.use(
    new Strategy(async (username, password, done) => {
        try {
            const findUser = await User.findOne({ where: { username } });
            if (!findUser) {
                return done(null, false, { message: 'User not found' });
            }
            const isMatch = await comparePassword(password, findUser.password);
            if (!isMatch) {
                return done(null, false, { message: 'Invalid Credentials' });
            }
            return done(null, findUser);
        } catch (error) {
            return done(error);
        }
    })
);

module.exports = passport;