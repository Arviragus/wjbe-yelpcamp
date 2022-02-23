const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utils/AsyncWrapper');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    // render index of campgrounds
    .get(AsyncWrapper(campgrounds.index))
    // create a new campground
    .post(isLoggedIn, upload.array('image'), validateCampground, AsyncWrapper(campgrounds.createCampground));

// render new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    // show a campground
    .get(AsyncWrapper(campgrounds.showCampground))
    // update a campground
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, AsyncWrapper(campgrounds.updateCampground))
    // delete a campground
    .delete(isLoggedIn, isAuthor, AsyncWrapper(campgrounds.deleteCampground));

// render edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, AsyncWrapper(campgrounds.editCampground));

module.exports = router;


    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send('working!');
    // })
