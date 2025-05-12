const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn,isOwner,validateListing}=require("../middleware");
const Listing = require("../models/listing.js");
const listingController=require("../controllers/listing.js")
const multer=require('multer');
const upload=multer({dest: 'uploads/'})

router.route("/")
.get(wrapAsync(listingController.index))  // Index route
// .post(isLoggedIn,validateListing, wrapAsync(listingController.createListing));  //Create Route
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
});
//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))  //Show Route
.put(isLoggedIn,validateListing,isOwner, wrapAsync(listingController.updateListing))  //Update Route
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))     //Delete Route



//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports=router;