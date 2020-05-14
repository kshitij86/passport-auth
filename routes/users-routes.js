const router = require('express').Router(); 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/', (req, res, next) => {
    res.status(200).json({
        status: `OK`,
        msg: `Not a valid endpoint [/users]`
    }); 
}); 

router.get('/register', (req, res, next) => {
    res.render('register');
});

router.post('/register', (req, res, next) => {
    const { email, password } = req.body; 
    let errors = []; 
    
    if(!email || !password){
        errors.push({msg: "Please fill in all fields"});
    }

    if(password.length < 6){
        errors.push({msg: "Password too short"});
    }

    // Re-render with errors
    if(errors.length > 0){
        res.render('register', {
            errors, 
            email,
            password
        }); 
    } else {
        User.findOne({email: email})
        .then((fetchedUser) => {
            if(fetchedUser){
                errors.push({msg: "Email aready taken"});
                res.render('register', {
                    errors, 
                    email, 
                    password
                })
            } else {
                const newUser = new User({
                    email: email, 
                    password: password
                }); 
                bcrypt.genSalt(10, (saltError, salt) => {
                    bcrypt.hash(newUser.password, salt, (hashError, hash) => {
                        if(hashError) throw hashError;
                        // Hashed password
                        newUser.password = hash;
                        // Save new user
                        newUser.save()
                        .then((user) => {
                            req.flash('success_msg', 'You are registered');
                            res.redirect('/users/login')
                        })
                    });
                });
            }
        })
    }
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard', 
        failureRedirect: '/users/login', 
        failureFlash: true 
    })(req, res, next);  
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out'); 
    res.redirect('/users/login');
});

module.exports = router; 