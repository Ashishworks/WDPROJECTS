const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema} = require("../schema.js");
const {isLoggedIn}=require("../middleware");
const Listing = require("../models/listing.js");

const ExpressError = require("../utils/ExpressError.js");



const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Index route
router.get("/", async (req, res) => {
    let allresult = await Listing.find()
    res.render("./listing/index.ejs", { allresult })
})

//new route
router.get("/new",isLoggedIn, (req, res) => {
    res.render("./listing/new.ejs")
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await Listing.findById(id).populate("review").populate("owner");
    console.log(singledata);
    if(!singledata){
        req.flash("error","Listing You Requested for doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs", { singledata })
}))




//Create Route
router.post("/",isLoggedIn,validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data for listing")
    // }
    const listing1 = new Listing(req.body.listing);
    listing1.owner=req.user._id;
    await listing1.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
}
))


//Edit Route
router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await Listing.findById(id);
    if(!singledata){
        req.flash("error","Listing You Requested for doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listing/edit.ejs", { singledata })
}))

//Update Route
router.put("/:id",isLoggedIn,validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`)
}))

//Delete Route
router.delete("/:id",isLoggedIn,wrapAsync(async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Listing Delted!");
    res.redirect("/listing");
}))

module.exports=router;