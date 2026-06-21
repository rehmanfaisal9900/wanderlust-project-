const mongoose = require("mongoose");
const { findByIdAndDelete } = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: Object,
    default: {
      filename: String,
      url: String,
    },
    set: (v) => {
      if (!v || v === "" || (typeof v === "object" && !v.url) || v.url === "") {
        return {
          filename: "listingimage",
          url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        };
      }
      if (typeof v === "string") {
        return {
          filename: "listingimage",
          url: v
        };
      }
      return v;
    }
  },
  price: Number,
  location: String,
  country: String,
  reviews : [ {
    type : Schema.Types.ObjectId,
    ref : "Review",
  },
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
});
  
listingSchema.post("findByIdAndDelete",async (listing)=>{
  if(listing){
      await Review.deleteMany({_id : {$in:listing.review}});
      } 
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;