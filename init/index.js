const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const dataobj=require("./data.js")
const MongoStore=require("connect-mongo");
require("dotenv").config({ path: "../.env" });



// const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
const dbUrl =process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",(err)=>{
    console.log("Error is MONGO SESSION STORE",err);
});

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

const init=async ()=>{
    await listing.deleteMany({});
    dataobj.data=dataobj.data.map((obj)=>({
        ...obj,
        owner: "68277848d369d0036ad4d8a6",
    }));
    await listing.insertMany(dataobj.data);
    console.log("Data is initialised")
}

init();
