                                            const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const swaggerSpec= require('./config/swagger'); 
const swaggerUi = require("swagger-ui-express");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, origin || '*');
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/portfolio', require('./routes/portfolioRoutes'));
app.use('/api/category', require('./routes/categoryRoutes'));
app.use('/api/service', require('./routes/serviceRoutes'));

app.get('/', (req, res) => res.send('API is running...'));

module.exports = app;
