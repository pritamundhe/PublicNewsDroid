const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/authRoutes');

dotenv.config();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
