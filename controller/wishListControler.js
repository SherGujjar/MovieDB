const Movie = require('../model/moviesModel');
const WishList = require('../model/wishListGroup')
const checkPermission = require('../utils/checkPermission');

const createGroup = async(req,res,next)=>{
    try {
        req.body.user = req.user.id;
        const movieGroup = await WishList.create(req.body);
        res.status(200).json({
            success:true,
            movieGroup
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

const AddMovieToAList = async(req,res,next)=>{
    try {
        const movieGroup = req.params.id;
        const isValidMovieGroup = await WishList.findById(movieGroup);
        if(!isValidMovieGroup){
            return res.status(401).json({
                message:"No such WishList created by You"
            })
        }

        if(!checkPermission(req.user,isValidMovieGroup.user)){
            return res.status(403).json({
                message:"Not Allowed to access this route"
            })
        }

        const movie = req.body.movie;

        const isValidMovie = await Movie.findById(movie);
        if(!isValidMovie){
            return res.status(401).json({
                message:"No such Movie present in our Website"
            })
        }

        let find = false;
        isValidMovieGroup.movie.forEach(element => {
            if(element==movie){
                find=true;
                return;
            }
        });

        if(!find){
            isValidMovieGroup.movie.push(movie);
            await isValidMovieGroup.save();
            res.status(201).json({
                success:true,
                isValidMovieGroup
            })
    
        }
        else{
            res.status(400).json({
                success:false,
                message:"Movie Already exist in this List"
            })
        }
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
}

const deleteMovieFromAList = async(req,res,next)=>{
    try {
        const movieGroup = req.params.id;
        const isValidMovieGroup = await WishList.findById(movieGroup);
        if(!isValidMovieGroup){
            return res.status(401).json({
                message:"No such WishList created by You"
            })
        }

        if(!checkPermission(req.user,isValidMovieGroup.user)){
            return res.status(403).json({
                message:"Not Allowed to access this route"
            })
        }

        const movie = req.body.movie;

        const isValidMovie = await Movie.findById(movie);
        if(!isValidMovie){
            return res.status(401).json({
                message:"No such Movie present in our Website"
            })
        }
       
        isValidMovieGroup.movie = isValidMovieGroup.movie.filter((element)=>{
            return element.toString()!==movie.toString();
        })
        
        await isValidMovieGroup.save();
            res.status(201).json({
            success:true,
            isValidMovieGroup
        })
    } catch (error) {
        res.status(400).json({
            message:error.message
        })
    }
}

const getWishList = async(req,res,next)=>{
    try {
        const id = req.params.id;
        const isValidGroup =await WishList.findById(id);
        if(!isValidGroup){
            return res.status(401).json({
                success:false,
                message:"No Such List created by you"
            })
        }

        if(!checkPermission(req.user,isValidGroup.user)){
            return res.status(403).json({
                message:"Not Allowed to access this route"
            })
        }

        res.status(200).json({
            success:true,
            isValidGroup
        })
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:error.message
        })
    }
}

const usersList = async(req,res,next)=>{
    try {
        const userList = await WishList.find({user:req.user});
        if(!userList){
            return res.status(400).json({
                success:false,
                message:"Thier is no wishList created By This User"
            })
        }

        res.status(200).json({
            success:true,
            userList,
            count:userList.length
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

module.exports = {createGroup,AddMovieToAList,deleteMovieFromAList,getWishList,usersList};