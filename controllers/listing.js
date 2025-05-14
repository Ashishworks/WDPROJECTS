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
    let url=req.file.path;
    let filename=req.file.filename;
    const listing1 = new Listing(req.body.listing);
    listing1.owner=req.user._id;
    listing1.image={url,filename};
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
    let originalImageUrl=singledata.image.url
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listing/edit.ejs", { singledata,originalImageUrl })
};

module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
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