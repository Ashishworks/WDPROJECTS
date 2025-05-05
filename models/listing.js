const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review=require("./review.js");
const { listingSchema } = require("../schema");

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
        type: Object,
        default: "https://cdn.pixabay.com/photo/2023/04/19/09/34/flower-7937334_1280.jpg",
        set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2023/04/19/09/34/flower-7937334_1280.jpg" : v
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
});

// mongoose middleware
lschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});
    }
});
const listing = mongoose.model("listing", lschema);

module.exports = listing;