const router = require('express').Router();
const User = require('../model/Users');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const passport = require('passport');

//Registration
router.get('/register', (req, res) => {
    res.render('../views/register');
});

router.post('/register', async (req, res) => {
    //Pull information from registration form
    const { name, email, password, password2 } = req.body;

    //Validation
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    if (password !== password2) {
        return res.status(400).send('Passwords do not match');
    }

    //Check db for existing user
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).send('User already exist!');
        }
    } catch (error) {
        console.log('here');
        return res.status(400).send(error);
    }

    //Encrypt password
    const saltRounds = 10;
    const genSalt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, genSalt);

    //Create user object
    const user = new User({
        name,
        email,
        password: hashed
    });

    //Save user to the form
    try {
        const saveUser = await user.save();
        res.redirect('./login');
    } catch (error) {
        res.status(400).send(error);
    }
});

//Login
router.get('/login', (req, res) => {
    res.render('../views/login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/account/login',
        failureFlash: false
    })(req, res, next);
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
