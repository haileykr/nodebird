const passport = require('passport');
const local =  require('./local');
const { User } = require('../models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        // too heavy to store everything in session
        // store just the id!
        done(null, user.id); //first param - server error, second param - success
    });
    passport.deserializeUser(async (id, done) => {
        try {
            // get more info from the database using the id
            const user = await User.findOne({where: {id}})
        
            done(null, user);
        } catch (error) {
            console.error(error);
            done(error);
        }
    });

    local();
}