const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const Listing = require("./models/listing.js")
const ExpressError = require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")));
app.use("/listing",listings);
app.use("/listing/:id/reviews",reviews)

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

// app.get("/listing0", async (req, res) => {
//     const listing1 = new Listing({
//         title: "wonderland2",
//         description: "beautiful place",
//         price: 2000,
//         location: "Jaipur",
//         country: "India"
//     });
//     await listing1.save();
//     res.send("data saved")
// })









// app.post("/listing", async (req, res,next) => {
//     try {
//         const listing1 = new listing(req.body.listing);
//         await listing1.save();
//         res.redirect("/listing");
//     } catch (err) {
//         next(err);
//     }
// })



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("./listing/error.ejs", { message })
})

