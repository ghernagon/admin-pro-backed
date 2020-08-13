require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');


// Middlewares
// Create express server
const app = express();

// Config CORS
app.use( cors() );

// Read and parse body
app.use( express.json() );

// End Middlewares

// Connect to DB
dbConnection();

// DotEnv env properties
// console.log(process.env);

// Routes
app.use('/api/users', require('./routes/users.routes'));


app.listen( process.env.PORT, () => {
    console.log('server running in port ' + process.env.PORT);
})