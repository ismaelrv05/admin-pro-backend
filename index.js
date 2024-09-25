require('dotenv').config(); //To read environment variables and stablish them in environment variables of NodeJS

const express = require('express');  //similar to import express from 'express' 
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Create express server 
const app = express();  //to inicialize express aplication 

//Configure cors
app.use(cors()); //use is a middleware

//Database connection
dbConnection();

console.log( process.env );

//Rutas
app.get( '/', (req,res) => {
    res.json({
        ok: true,
        msg: 'Hola Mundo'
    });
});

//To run the aplication
app.listen(process.env.PORT,() =>{
    console.log('Server is running on port ' + process.env.PORT);  
}); 