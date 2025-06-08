require('dotenv').config(); //To read environment variables and stablish them in environment variables of NodeJS

const express = require('express');  //similar to import express from 'express' 
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Create express server 
const app = express();  //to inicialize express aplication 

const chatbotRouter = require('./routes/chatbot');

//Configure cors
app.use(cors()); //use is a middleware

// Carpeta pública
 app.use( express.static('public')); 

// Lectura y parseo del body
app.use(express.json()); 
 
//Database connection
dbConnection();

console.log( process.env );

//Rutas
app.use( '/api/usuarios', require('./routes/usuarios') );
app.use( '/api/login', require('./routes/auth') );
app.use( '/api/inmuebles', require('./routes/inmuebles') );
app.use( '/api/all', require('./routes/busquedas') );
app.use( '/api/upload', require('./routes/uploads') );
app.use('/api/importar', require('./routes/importar') );
app.use('/api/chatbot', chatbotRouter);




//To run the aplication
app.listen(process.env.PORT,() =>{
    console.log('Server is running on port ' + process.env.PORT);  
}); 

//eXUYUzZVwzselzof