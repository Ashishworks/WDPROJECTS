const Listing = require("../models/listing.js");


module.exports.index=async(req, res) => {
    let allresult = await Listing.find()
    res.render("./listing/index.ejs", { allresult })
};

module.exports.renderNewForm= (req, res) => {
    res.render("./listing/new.ejs")
};

module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const singledata = await Listing.findById(id).populate({path: "review", populate:{path:"author"},}).populate("owner");
    if(!singledata){
        req.flash("error","Listing You Requested for doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listing/show.ejs", { singledata })
};

module.exports.createListing=async (req, res, next) => {
    const listing1 = new Listing(req.body.listing);
    listing1.owner=req.user._id;
    await listing1.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    let singledata = await Listing.findById(id);
    if(!singledata){
        req.flash("error","Listing You Requested for doesn't exist");
        res.redirect("/listing");
    }
    res.render("./listing/edit.ejs", { singledata })
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`)
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let del = await Listing.findByIdAndDelete(id);
    console.log(del);
    req.flash("success","Listing Delted!");
    res.redirect("/listing");
};