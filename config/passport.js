const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Get the User model
const User = require('../models/User');
module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match user
            User.findOne({email: email})
            .then((user) => {
                if(!user){
                    return done(null, false, {message: "Couldn't find that email"});
                }
                // Compare password
                bcrypt.compare(password, user.password, (error, isMatch) => {
                    if(error) throw error; 
                    if(isMatch){
                        return done(null, user); 
                    } else {
                        return done(null, false, {message: "Password is incorrect"}); 
                    }
                });
            }).catch(err => console.log(err));
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id); 
    }); 

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    });
}