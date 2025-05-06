const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema} = require("../schema.js");
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
router.get("/new", (req, res) => {
    res.render("./listing/new.ejs")
})

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await Listing.findById(id).populate("review");
    res.render("./listing/show.ejs", { singledata })
}))




//Create Route
router.post("/",validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data for listing")
    // }
    const listing1 = new Listing(req.body.listing);
    await listing1.save();
    res.redirect("/listing");
}
))


//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await Listing.findById(id);
    res.render("./listing/edit.ejs", { singledata })
}))

//Update Route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))

//Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listing");
}))

module.exports=router;