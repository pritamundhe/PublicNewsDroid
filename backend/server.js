const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const dotenv=require("dotenv");
const http = require('http');
const socketIo = require('socket.io');
const userRoutes = require('./routes/authRoutes');
const newsRoutes=require('./routes/newsRoutes');

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



app.use('/users', userRoutes);
app.use('/news', newsRoutes);

server.listen(PORT,()=>{
    console.log("app listenng on port:",PORT);
})