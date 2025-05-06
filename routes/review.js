const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js")
const {reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js");


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

//Review Post Route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let Listing2=await Listing.findById(req.params.id); 
    let newReview=new Review(req.body.review);
    Listing2.review.push(newReview);
    await newReview.save();
    await Listing2.save();
    console.log("review saved")
    res.redirect(`/listing/${Listing2._id}`)
},))


//Delete Route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    let m=await Review.findByIdAndDelete(reviewId);
    console.log(m);
    res.redirect(`/listing/${id}`)
}));


module.exports=router

