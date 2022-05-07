const mongoose = require("mongoose");

const Reviews = require('../model/reviewModel');


const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    rerquired: [true, "Please enter the Movie name"],
  },
  description: {
    type: String,
    required: [true, "Please provide the Movie Description"],
  },
  ratings:{
    type:Number,
    default:0
  },
  numOfReviews:{
    type:Number,
    default:0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category:{
      type:String,
      required:[true,"Please enter the cotegory"]
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    req:true,
  },
  createdAt:{
      type:Date,
      default:Date.now
  }
  
});

movieSchema.pre("remove",async function(next){
  
  await this.model('Reviews').deleteMany({movie:this._id});
  
})



module.exports = mongoose.model("Movies",movieSchema);
