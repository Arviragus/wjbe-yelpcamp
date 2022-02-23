const User = require('../models/user');

// render register page
module.exports.registerForm = (req, res) => {
    res.render('users/register');
}

// register a new user
module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp-Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};

// render login form
module.exports.userLogin = (req, res) => {
    res.render('users/login')
};

// login user
module.exports.confirmLogin = (req, res) => {
    req.flash('success', 'Successfully logged in!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
};

// logout user
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully logged out!');
    res.redirect('/campgrounds');
};
