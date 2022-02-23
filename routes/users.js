const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utils/AsyncWrapper');
const passport = require('passport');
const users = require('../controllers/users')

// REGISTRATION
router.route('/register')
    // render register form
    .get(users.registerForm)
    // register new user
    .post(AsyncWrapper(users.registerUser));

// LOGIN
router.route('/login')
    // render login form
    .get(users.userLogin)
    // authenticate login
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.confirmLogin);

router.get('/logout', users.logout);

module.exports = router;
