/* Application routes file */

const express = require('express');
const app = express();
const morgan = require('morgan');
const dbUtil = require('./mongoDbUtil');
const customerRoutes = require('./api/customer');

// Using morgan module for error handling
app.use(morgan('dev'));

// Parsing JSON body data in requests
app.use(express.json());

// Database connection code
dbUtil.connect(function(error){
    if(error){
        console.log(error);
    }
});

// API routes
app.use("/customer", customerRoutes);

// Throwing error if requests reach this line instead of using the above customerRoutes
app.use(function(request, repsonse, next){
    var error = new Error('Not found');
    error.status = 404;
    next(error);
});

// Handling errors thrown in the application
app.use(function(error, request, response, next){
    console.log(error.message);
    response.status(error.status || 500);
    response.json({
        "error": error.message
    });
});

// Module export
module.exports = app;
