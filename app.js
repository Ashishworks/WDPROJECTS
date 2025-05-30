if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const paymentRoutes = require('./routes/paymentRoutes');


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
app.engine('ejs', ejsMate)
app.use(express.static(path.join(__dirname, "/public")));

// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl =process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("Error is MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,  //in ms
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user; // cuz we can't access req.user() directly in ejs
    next();
});

app.get("/",async(req,res)=>{
    res.redirect("/listing")
})
app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use("/", paymentRoutes);






async function main() {
    await mongoose.connect(dbUrl);
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

