const passport = require('passport');
const { Strategy } = require('passport-local');
const { User } = require('../models');

passport.serializeUser((user, done) => {
    console.log('1. inside serializeUser callback. User id is save to the session file store here');
    console.log('user:', user);
    console.log('user.id:', user.id);
    done(null, user.id)
})

passport.deserializeUser( async (id, done) => {
    console.log('2. inside deserializeUser callback');
    console.log(`The user id passport saved in the session file store is: ${id}`);
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
        console.log('username:', username);
        console.log('password:', password);
        try{
            const findUser = await User.findOne({ where: { username } });
            if (!findUser) {
                throw new Error('User not found');
            }
            if (findUser.password !== password) {
                throw new Error('Invalid Credentials');
            }
            return done(null, findUser);
        } catch (error) {
            return done(error, null);
        }
    })
);

module.exports = passport;