const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review=require("./models/review.js");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")))

app.get('/', (req, res) => {
    res.send("site working");
})

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => {
        console.log(err)
    });

app.listen(8080, () => {
    console.log("connected")
})

app.get("/listing0", async (req, res) => {
    const listing1 = new listing({
        title: "wonderland2",
        description: "beautiful place",
        price: 2000,
        location: "Jaipur",
        country: "India"
    });
    await listing1.save();
    res.send("data saved")
})

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join("");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}

// Index route
app.get("/listing", async (req, res) => {
    let allresult = await listing.find()
    res.render("./listing/index.ejs", { allresult })
})

//show route
app.get("/listing/new", (req, res) => {
    res.render("./listing/new.ejs")
})

// app.post("/listing", async (req, res,next) => {
//     try {
//         const listing1 = new listing(req.body.listing);
//         await listing1.save();
//         res.redirect("/listing");
//     } catch (err) {
//         next(err);
//     }
// })



//Create Route
app.post("/listing",validateListing, wrapAsync(async (req, res, next) => {
    // if(!req.body.listing){
    //     throw new ExpressError(404,"send valid data for listing")
    // }
    const listing1 = new listing(req.body.listing);
    await listing1.save();
    res.redirect("/listing");
}
))

//Show Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await listing.findById(id).populate("review");
    res.render("./listing/show.ejs", { singledata })
}))

//Edit Route
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let singledata = await listing.findById(id);
    res.render("./listing/edit.ejs", { singledata })
}))

//Update Route
app.put("/listing/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listing/${id}`)
}))

//Delete Route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let del = await listing.findByIdAndDelete(id);
    console.log(del);
    res.redirect("/listing");
}))

//Review Post Route
app.post("/listing/:id/reviews",wrapAsync(async(req,res)=>{
    let Listing=await listing.findById(req.params.id); 
    let newReview=new Review(req.body.review);
    Listing.review.push(newReview);

    await newReview.save();
    await Listing.save();
    console.log("review saved")
    res.redirect(`/listing/${Listing._id}`)
},))


//Delete Route
app.delete("/listing/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    console.log(id,reviewId);
    await listing.findByIdAndUpdate(id,{$pull: {review: reviewId}});
    let m=await Review.findByIdAndDelete(reviewId);
    console.log(m);
    res.redirect(`/listing/${id}`)
}));



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("./listing/error.ejs", { message })
})

