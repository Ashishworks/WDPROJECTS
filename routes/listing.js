const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware");
const Listing = require("../models/listing.js");
const listingController=require("../controllers/listing.js")

router.route("/")
.get(wrapAsync(listingController.index))  // Index route
.post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));  //Create Route

router.route("/:id")
.get(wrapAsync(listingController.showListing))  //Show Route
.put(isLoggedIn,validateListing,isOwner, wrapAsync(listingController.updateListing))  //Update Route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))     //Delete Route

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;