const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");
const {validateReview}=require("../middleware");



//Review Post Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let Listing2=await Listing.findById(req.params.id); 
    let newReview=new Review(req.body.review);
    Listing2.review.push(newReview);
    await newReview.save();
    await Listing2.save();
    console.log("review saved")
    req.flash("success","Review Saved!");
    res.redirect(`/listing/${Listing2._id}`)
},))


//Delete Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    let m=await Review.findByIdAndDelete(reviewId);
    console.log(m);
    req.flash("success","Review Deleted!");
    res.redirect(`/listing/${id}`)
}));


module.exports=router

