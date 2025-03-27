const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")
const path=require("path");

app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))

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

app.get("/listing0",async (req, res) => {
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

app.get("/listing",async(req,res)=>{
    let allresult=await listing.find()
    res.render("./listing/index.ejs",{allresult})
})

app.get("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    let singledata=await listing.findById(id);
    res.render("./listing/show.ejs",{singledata})
})