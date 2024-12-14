// to import 
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDb');
const colors = require('colors');

// to initialize express
const app = express();
// load environment variable
dotenv.config({path:".env"})

// connect to database
connectDB();
//  to show that it is json format 
app.use(express.json());

// mount routes
const auth = require('./routes/auth');
const blog = require('./routes/authblog')

app.use('/api/v1/auth', auth);
app.use('/api/v1/blog', blog);

const PORT = 5000;

// for it to run on the port
const server = app.listen(PORT,
    console.log(`server running on ${PORT}`.yellow.bold)   
)  