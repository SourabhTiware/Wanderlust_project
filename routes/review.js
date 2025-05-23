const express = require("express");
const router = express.Router({mergeParams: true}); // const router = express.Router({option}) visit express router page. 
const Reviews = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/review.js");


// Review
// Post Route

router.post("",isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

// Review
// DELETE Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;