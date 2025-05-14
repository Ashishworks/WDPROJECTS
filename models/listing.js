const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review=require("./review.js");
const { listingSchema } = require("../schema");
const { ref } = require("joi");

const lschema = new schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    review: [{
        type: schema.Types.ObjectId,
        ref: "Review",
    },],
    owner:{
        type: schema.Types.ObjectId,
        ref:"user",
    }
}); 

// mongoose middleware
lschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});
const listing = mongoose.model("listing", lschema);

module.exports = listing;