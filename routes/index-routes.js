const router = require('express').Router(); 
const { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res, next) => {
    res.render('welcome'); 
}); 

// Protected route
router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
    res.render('dashboard', {
        email: req.user.email
    }); 
}); 


module.exports = router; 