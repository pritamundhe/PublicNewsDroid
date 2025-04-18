const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/authRoutes');
const newsRoutes=require('./routes/newsRoutes');
const adminRoutes=require('./routes/adminRoutes');

const app=express();
const server = http.createServer(app);

const PORT=5000;

app.use(cors());
dotenv.config();
app.use(express.json()); 


const MONGO_URL=process.env.MONGO_URL;
const CLIENT_URL=process.env.CLIENT_URL;

const io = socketIo(server, {
  cors: {
    origin: CLIENT_URL, 
    methods: ["GET", "POST","PUT","DELETE","PATCH"],
    credentials: true
  }
});

mongoose.connect(MONGO_URL)
    .then(()=>{
        console.log("Connect to MongoDB Atlas");
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


io.on('connection', (socket) => {
    console.log('A user connected');  
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/news', newsRoutes);

// console.log("Cloudinary Config:", {
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY ? "Exists" : "Missing",
//     api_secret: process.env.CLOUDINARY_API_SECRET ? "Exists" : "Missing",
//   });


server.listen(PORT,()=>{
    console.log("app listenng on port:",PORT);
})