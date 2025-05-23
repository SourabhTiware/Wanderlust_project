const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
       type: String,
       required: true,
    },

    description: String,

    image: {
        // url: {
            // type: String,
            // default: "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D",
            // set: (v) => (v && v.trim() !== "" ? v : "https://images.unsplash.com/photo-1530076886461-ce58ea8abe24?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D"),

            /* while adding data.js file in this file we declare a type of imgage is type: Stirng url but 
            while first time adding image on DB that time set a different type. with set attribute.  */

           
        // },
        url: String,
        filename: String,
    },

    price: Number,
    location: String, 
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review" // Review model - present in review.js 
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
             required: true
       }
    },

    category:{
        type: String,
        enum: ["trending", "rooms", "iconic-cities", "mountains", "castles", "camping", "farms", "arctic", "domes", "boat"]
    }
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
   
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports=Listing;