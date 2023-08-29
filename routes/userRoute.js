const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.get('/sign-up', userController.getSignupForm);
router.get('/log-in', userController.getLoginForm);
router.get('/profile', passport.checkAuthentication,userController.profile);
router.post('/create', userController.create);
router.post('/create-session', passport.authenticate('local', {failureRedirect:'/users/log-in'}),userController.createSession);
router.get('/sign-out', userController.signout);
router.get('/change-password', passport.checkAuthentication,userController.getChangePasswordForm);
router.post('/change-password', passport.checkAuthentication,userController.changePassword);
router.get('/forgot-password', userController.getForgotPassword);
router.get('/reset-password/:token', userController.getResetPassword);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);


router.get('/auth/google', passport.authenticate('google', {scope:['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect:'/users/log-in'}), userController.createSession);







module.exports = router;