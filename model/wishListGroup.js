const mongoose = require('mongoose');

const wishListGroupSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    movie:[{
        type:mongoose.Schema.ObjectId,
        ref:"Movies",
    }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
        
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updateAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("WishListGroup",wishListGroupSchema);