if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
// const helmet = require('helmet');

// deployable mongo:
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})

// sanitize user inputs
const mongoSanitize = require('express-mongo-sanitize');

// import models
const campgrounds = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// connect mongoose
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// boot express
const app = express();

// engine (ejs booster)
app.engine('ejs', engine);

// sets (for ejs)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// uses (express, method-override)
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisisnotasecret';

const store = new MongoDBStore({
   url: dbUrl,
   secret,
   touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
   console.log("Session Store Error:..", e)
});

const sessionConfig = {
   store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
       httpOnly: true,
      //  secure: true,
       expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
       maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// cookies and flash
app.use(session(sessionConfig));
app.use(flash());

// // helmet settings
// const scriptSrcUrls = [
//    "https://stackpath.bootstrapcdn.com",
//    "https://api.tiles.mapbox.com",
//    "https://api.mapbox.com",
//    "https://kit.fontawesome.com",
//    "https://cdnjs.cloudflare.com",
//    "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//    "https://kit-free.fontawesome.com",
//    "https://stackpath.bootstrapcdn.com",
//    "https://api.mapbox.com",
//    "https://api.tiles.mapbox.com",
//    "https://fonts.googleapis.com",
//    "https://use.fontawesome.com",
// ];
// const connectSrcUrls = [
//    "https://api.mapbox.com/",
//    "https://a.tiles.mapbox.com/",
//    "https://b.tiles.mapbox.com/",
//    "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//    helmet.contentSecurityPolicy({
//        directives: {
//            defaultSrc: [],
//            connectSrc: ["'self'", ...connectSrcUrls],
//            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//            workerSrc: ["'self'", "blob:"],
//            childSrc: ["blob:"],
//            objectSrc: [],
//            imgSrc: [
//                "'self'",
//                "blob:",
//                "data:",
//                "https://res.cloudinary.com/wjbetech/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
//                "https://images.unsplash.com",
//            ],
//            fontSrc: ["'self'", ...fontSrcUrls],
//        },
//    })
// );

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// connect-flash middleware (use success to call)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// routing
app.use('/', userRoutes);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// set up port listener with auto-message on update via nodemon
app.listen(3000, () => {
    console.log('Updating...')
    console.log('CONNECTED!')
    console.log('Serving on Port: 3000')
})
