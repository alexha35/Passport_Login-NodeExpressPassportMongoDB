//ensures the user is logged in to view
module.exports = {
    authentication: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        //If user try to access dashboard through url
        res.render('error.ejs');
    }
};
