const router = require('express').Router();
const { authentication } = require('../passportConfig/authenticate');

//User homepage
router.get('/', authentication, (req, res) => {
    res.render('../views/dashboard',{user: req.user});
});

module.exports = router;
