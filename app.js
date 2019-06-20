const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require('passport');

//configuration
require('./passportConfig/passportStrategy')(passport);
dotenv.config();

//Use ejs view engine
app.set('view engine', 'ejs');

//express body parser
app.use(express.urlencoded({ extended: true }));

//express session
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true
    })
);

//Passport initializer
app.use(passport.initialize());
app.use(passport.session());

//Connect to user DB
mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true }, () => {
    console.log('Connected to DB successfully');
});

//Required routes
const index = require('./routes/index');
const account = require('./routes/account');
const dashboard = require('./routes/dashboard');

//routes
app.use('/account', account);
app.use('/dashboard', dashboard);
app.use('/', index);

//Listen on a port
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
