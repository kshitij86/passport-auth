// External packages
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts'); 
const morgan = require('morgan');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Internal routes & modules
const indexRoutes = require(`./routes/index-routes`);
const usersRoutes = require(`./routes/users-routes`);
require(`./config/passport`)(passport); // Passport config

// Server decalarations
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: false })); // Body parser
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));  // Express Session
app.use(flash());
// Set flash categories
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg'); 
    res.locals.error_msg = req.flash('error_msg'); 
    res.locals.error = req.flash('error');
    next();
});
app.use(passport.initialize());
app.use(passport.session());


// Database connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
.then(() => {console.log(`Connected to database...`)})
.catch((error) => {console.log(`Database connection failed`)});

// Routes for the site
app.use('/', indexRoutes);
app.use('/users/', usersRoutes);


app.listen(PORT, () => console.log(`Express server started at port: ${PORT}`));
