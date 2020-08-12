require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');

// Create express server
const app = express();

// Config CORS
app.use( cors() );

// Connect to DB
dbConnection();

// DotEnv env properties
// console.log(process.env);

// Routes
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hello World'
    });
});


app.listen( process.env.PORT, () => {
    console.log('server running in port ' + process.env.PORT);
})