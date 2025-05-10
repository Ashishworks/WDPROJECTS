const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const dataobj=require("./data.js")

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

const init=async ()=>{
    await listing.deleteMany({});
    dataobj.data=dataobj.data.map((obj)=>({
        ...obj,
        owner: "681c838847beac5a3b24ad2f",
    }));
    await listing.insertMany(dataobj.data);
    console.log("Data is initialised")
}

init();
