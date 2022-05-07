const Movies = require('../model/moviesModel');
const Reviews = require('../model/reviewModel');
const wishListGroup = require("../model/wishListGroup");
// create movies
const createMovies = async(req,res,next)=>{
    try {
        req.body.user = req.user.id;
        const movie = await Movies.create(req.body);
        res.status(201).json({
            success:true,
            movie
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

// get All Movies

const getAllMovies = async(req,res,next)=>{
    try {
        const movie = await Movies.find();
        res.status(200).json({
            success:true,
            movie,
            count:movie.length
        })
    } catch (error) {
        console.log(error)
        res.staus(400).json({
            success:false,
            message:error.message
        })
    }
}

const updateMovies = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const movie = await Movies.findById(id);
        if(!movie){
            res.status(400).json({
                message:`No Movies Exist with this ${id}`
            })
        }
        await Movies.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:false,
        });
        res.status(201).json({
            success:true,
        })
    }
    catch(error){
        res.status(200).json({
            message:error.message
        })
    }
}

const deleteMovies = async(req,res,next)=>{
    try {
        const movie = await Movies.findById(req.params.id);
        if(!movie){
            return res.status(404).json({
                message:`No Movies Exist with this ${id}`
            })
        }

        deleteMoviesFromAllList(req.params.id);

        // now before deleteing the movie we should delet all reviews present on that movie

        movie.remove();
        res.status(200).json({
            success: true,
            message: "Product Deleted SuccessFully",
        });
    } catch (error) {
        res.status(200).json({
            message:error.message
        })
    }
}

const getSingleMovie = async(req,res,next)=>{
    try {
        const movie = await Movies.findById(req.params.id);
        if(!movie){
            return res.status(404).json({
                message:`No Movies Exist with this ${req.params.id}`
            })
        }
        res.status(200).json({
            success: true,
            movie
        });
    } catch (error) {
        res.status(200).json({
            message:error.message
        })
    }
}

// deleting a movie from a list if the movie is deleted from database

const deleteMoviesFromAllList = async (movieId)=>{
    try {
        const AllList = await wishListGroup.find();
        AllList.forEach(async ({_id})=>{

            const List = await wishListGroup.findById(_id);

            List.movie = List.movie.filter((element)=>{
                return element.toString()!==movieId.toString();
            })
            await List.save();
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = {getAllMovies,createMovies,updateMovies,deleteMovies,getSingleMovie};
