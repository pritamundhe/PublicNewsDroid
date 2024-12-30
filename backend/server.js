const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
const userRoutes = require('./routes/authRoutes');

const app=express();

const PORT=5000;

app.use(cors());
dotenv.config();
app.use(express.json()); // Parses incoming JSON requests


const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("Connect to MongoDB Atlas");
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


//app.use('/users', authRoutes);
app.use('/users', userRoutes);

app.listen(PORT,()=>{
    console.log("app listenng on port:",PORT);
})