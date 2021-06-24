// local login strategies
const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email", //data got from the form submit

        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            return done(null, false, { reason: "The user does not exist." });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            //if password input and password in the database match..
            return done(null, user); //pass in user data in case of success
          }
          return done(null, false, { reason: "Wrong password" });
        } catch (error) {
          console.error(error);
          return done(error);//in case of server error, pass in error as the first parameter
        }
      }
    )
  );
};
