const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utills/wrapAsync.js");
const ExpressError = require("../utills/ExpressError.js"); 
const Listing = require("../models/listing.js")
const {validateReview, isLoggedIn,isReviewAuthor}= require("../middleware.js");
const Review = require("../models/review.js");
const reviewController = require("../controllers/reviews.js");


// review routes
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

// delete reviews routs 
router.delete("/:reviewsId",isReviewAuthor,isLoggedIn,wrapAsync(reviewController.destroyReview));

module.exports = router;