// local-strategy.js
// Passport (Local Strategy) Configuration

const passport = require("passport");
const { Strategy } = require("passport-local");
const { User } = require("../models");
const bcrypt = require("bcrypt");
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Checking if a password is correct via bcrypt
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Deserialize the user
passport.deserializeUser(async (id, done) => {
  try {
    const findUser = await User.findOne({ where: { id } });
    if (!findUser) {
      throw new Error("User not found");
    }
    return done(null, findUser);
  } catch (error) {
    return done(error, null);
  }
});

// Local Strategy
passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const findUser = await User.findOne({ where: { email } });
      if (!findUser) {
        return done(null, false, { message: "User not found" });
      }
      const isMatch = await comparePassword(password, findUser.password);
      if (!isMatch) {
        return done(null, false, { message: "Invalid Credentials" });
      }
      return done(null, findUser);
    } catch (error) {
      return done(error);
    }
  })
);

module.exports = passport;
