const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utils/AsyncWrapper');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

router.post('/', isLoggedIn, validateReview, AsyncWrapper(reviews.postReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncWrapper(reviews.deleteReview));

module.exports = router;
