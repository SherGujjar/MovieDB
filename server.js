require('dotenv').config();

const express = require('express');
const mongoose  = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishListRoutes = require('./routes/wishListRoutes');

const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());


app.use('/api/v1',userRoutes);
app.use('/api/v1',movieRoutes);
app.use('/api/v1',reviewRoutes);
app.use('/api/v1',wishListRoutes);

const start = async()=>{
    try {
        mongoose.connect(process.env.MONGO_URI);
        app.listen(process.env.PORT,()=>{
            console.log(`Server is Listening at port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start();

