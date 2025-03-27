const express = require("express");
const app = express();
const mongoose = require("mongoose");
const listing = require("./models/listing.js")


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

app.get("/listing",async (req, res) => {
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