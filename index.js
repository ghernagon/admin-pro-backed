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
app.use('/api/login', require('./routes/auth.routes'));
app.use('/api/hospitals', require('./routes/hospitals.routes'));
app.use('/api/doctors', require('./routes/doctors.routes'));
app.use('/api/search', require('./routes/search.routes'));
app.use('/api/upload', require('./routes/uploads.routes'));


app.listen( process.env.PORT, () => {
    console.log('server running in port ' + process.env.PORT);
})