const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;