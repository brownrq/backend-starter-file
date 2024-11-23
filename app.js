// to import 
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDb');

// to initialize express
const app = express();
// load environment variable
dotenv.config({path:".env"})

//  to show that it is json format 
app.use(express.json());

connectDB();

const PORT = 5000;

// for it to run on the port
const server = app.listen(PORT,
    console.log(`server running on ${PORT}`)   
)