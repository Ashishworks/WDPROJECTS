const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware");
const reviewController = require("../controllers/review.js");



//Review Post Route
router.post("/",validateReview,isLoggedIn,wrapAsync(reviewController.createReview))


//Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router

