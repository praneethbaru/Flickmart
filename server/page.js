/* Web page routes file */

const express = require('express');
const router = express.Router();
const fs = require('fs');

// Get index page
router.get('/index', function(request, response, next) {
    fs.readFile('index.html', function(err, data) {
        if(err){
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
});

// Get main page
router.get('/mainpage', function(request, response, next) {
    fs.readFile('mainpage.html', function(err, data) {
        if(err){
            throw err;
        }

        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
    });
});

module.exports = router;
