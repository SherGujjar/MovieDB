
const Movies = require('../model/moviesModel');
const Reviews = require('../model/reviewModel');

const checkPermission = require('../utils/checkPermission')

const createReview = async(req,res,next)=>{
    try {
        req.body.user = req.user.id;
        const {movie:movieId} = req.body;
        const isValidMovie = await Movies.findOne({_id:movieId});

        if(!isValidMovie){
            return res.status(400).json({
                message:"No such movie exist"
            })
        }

        const allreadySubmitted = await Reviews.findOne({
            movie:movieId,
            user:req.user.id,
        });

        if(allreadySubmitted){
            return res.status(400).json({
                message:"You have already submitted a review for this movie"
            })
        }

        const review = await Reviews.create(req.body);
        res.status(201).json({
            success:true,
            review
        });
    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

const updateReview = async(req,res,next)=>{
    try {
        const {id} = req.params;
        const { title, comment, rating } = req.body;
        const review = await Reviews.findById(id);
        if(!review){
            return res.status(400).json({
                message:`No review exist with this ${id}`
            })
        }
        if(!checkPermission(req.user,review.user)){
            return res.status(403).json({
                message:"Not Allowed to access this route"
            })
        }
        review.rating = rating;
        review.comment = comment;
        review.title = title;
        await review.save();
        res.status(201).json({
            success:true,
        }) 
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
}

const getAllReview = async(req,res,next)=>{
    try {
        const review = await Reviews.find();
        res.status(200).json({
            success:true,
            review,
            count:review.length
        })
    } catch (error) {
        console.log(error)
        res.staus(400).json({
            success:false,
            message:error.message
        })
    }
}

const deleteReview = async(req,res,next)=>{
    try {
        const review = await Reviews.findById(req.params.id);
        if(!review){
            return res.status(404).json({
                message:`No Reviews Exist with this ${req.params.id}`
            })
        }
        // now before deleteing the review we should delet all reviews present on that review

        if(!checkPermission(req.user,review.user)){
            return res.status(401).json({
                message:"Not Allowed to perform this action"
            })
        }

        await review.remove();
        res.status(200).json({
            success: true,
            message: "Review Deleted SuccessFully",
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({
            
            message:error.message
        })
    }
}

const getSingleReview = async(req,res,next)=>{
    try {
        const review = await Reviews.findById(req.params.id);
        if(!review){
            return res.status(404).json({
                message:`No Reviews Exist with this ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            review
        });
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
}

// delet all reviews of a moview if the movie is deleted from database

const deleteAllReviewOfOne  = async(req,res,next)=>{
    try {
        const movie = req.params.id;

       const isValidMovie =  await Movies.findById(movie);

        if(!isValidMovie){
            return res.status(400).json({
                success:false,
                message:"No such movie exist "
            })
        }
        
        const review = await Reviews.deleteMany({movie});
        
        res.status(200).json({
            success:true,
            message:"Reviews Deleted SuccessFully"
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }

}

const getAllReviewOfAMovie = async(req,res)=>{
    try {
        const movie = req.params.id;
        const isValidMovie = await Movies.findById(movie);

        if(!isValidMovie){
            return res.status(400).json({
                success:false,
                message:"No such movie exist "
            })
        }
        const review = await Reviews.find({movie});
        res.status(200).json({
            success:true,
            review,
            count : review.length
        })

    } catch (error) {
        res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {createReview,updateReview,deleteReview,getSingleReview,getAllReview,deleteAllReviewOfOne,getAllReviewOfAMovie}