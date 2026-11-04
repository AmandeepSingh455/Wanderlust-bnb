const express = require("express");
const router = express.Router({ mergeParams: true });
const ExpressError = require("../utils/expressError.js");
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



//reviews
//post review route

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview),
);

//delete Review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview),
);
module.exports = router;
