const User = require('../models/user');
const sendEmail = require('../mailer/sendMail');
const crypto = require('crypto');


// render signup form
module.exports.getSignupForm = (req, res) => {
    return res.render('signup');
}


// render login form
module.exports.getLoginForm = (req, res) => {
    return res.render('login');
}

// render forgot password form
module.exports.getForgotPassword = (req, res) => {
    return res.render('forgot_password');
}

// render reset password form
module.exports.getResetPassword = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetPasswordToken: token, resetPasswordTokenExpiresIn: { $gt: Date.now() },
        });
        if (!user) {
            return res.send('<h1>Invalid or expired token</h1>');
        }
        return res.render('reset_password', { token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred');
    }
}

// render user profile page if user is authenticated
module.exports.profile = async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.user._id);
        return res.render('user_profile', { user: user });
    }
    return res.redirect('/users/log-in');
}


module.exports.getChangePasswordForm = (req, res) => {
    if(req.isAuthenticated()) {
        return res.render('change_password');
    }
    return res.redirect('/users/log-in');
}


// register users
module.exports.create = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.send('<h1>Please provide both field</h1>');
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return res.send('<h1>User already exist!</h1>');
        }
        
        const users = await User.create({ name, email, password });
        return res.redirect('/users/log-in');
        
    } catch (error) {
        console.log(error);
        return res.send('<h1>Error occurred</h1>');
    }


}

// create session
module.exports.createSession = (req, res) => {
    return res.redirect('/');
}

// logout user
module.exports.signout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.redirect('/users/log-in');
    });
}


// change password
module.exports.changePassword = async(req, res) => {
    const {email, old_password, new_password} = req.body;
    try {
        if(!email || !old_password || !new_password) {
            return res.send('<h1>Please provide all field</h1>');
        }
        const user = await User.findOne({email:email, password:old_password});
        if(!user) {
            return res.send('<h1>User not found</h1>');
        }
       
        user.password = new_password;
        await user.save();
        return res.send('<h1>Password changed successfully!</h1>');

    } catch (error) {
        console.log(error);
        return res.send('<h1>Error occurred</h1>')
    }
}


// send forgot password email 
module.exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const token = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = token;
            user.resetPasswordTokenExpiresIn = Date.now() + 36000000;
            await user.save();
            // send email
            const origin = 'http://localhost:8000';
            sendEmail(user.name, user.email, origin, token);
            return res.send('<h1>Email send successfully!</h1>');
        }
    } catch (error) {
        console.log(error);
        return res.send('<h1>Error occurred</h1>')
    }
}

// reset password by token
module.exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const user = await User.findOne({
            resetPasswordToken: token, resetPasswordTokenExpiresIn: { $gt: Date.now() },
        });
        if (!user) {
            return res.send('<h1>Invalid or expired token</h1>');
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresIn = undefined;
        await user.save();
        return res.send('<h1>Password reset successfully!</h1>');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred');
    }
}