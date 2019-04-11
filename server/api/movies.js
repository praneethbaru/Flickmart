/* Movie routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const auth = require('./../authUtil');
const ObjectId = require('mongodb').ObjectId;

// Get movies with id endpoint
router.post('/getmovies', auth, function(request, response, next) {
    var query = {};

    // query to display search results if search string is not null
    if(request.body.search) {
        console.log(request.body.search);
        query = { $text : { $search : request.body.search } };
    }

    dbUtil.getDb().collection("movies").find(query).toArray(function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }
        response.status(200).json(result);
    });
});


module.exports = router;
