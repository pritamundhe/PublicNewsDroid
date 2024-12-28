const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");

const app=express();

const PORT=5000;

app.use(cors());
dotenv.config();

const MONGO_URL=process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("Connect to MongoDB Atlas");
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


app.listen(PORT,()=>{
    console.log("app listenng on port:",PORT);
})