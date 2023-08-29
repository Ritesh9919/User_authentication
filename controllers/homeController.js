const User = require('../models/user');

// render home page 

module.exports.home = async(req, res) => {
    if(req.isAuthenticated()) {
        const user = await User.findById(req.user._id);
        return res.render('home', {user});
    }
    return res.redirect('/users/log-in');
}
