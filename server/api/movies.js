/* Customer routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const authUtil = require('./../authUtil');
//const ObjectId = require('mongodb').ObjectId;

// Get movies with id endpoint
router.post('/getmovies', function(request, response, next) {
  var query={};
  if(request.body.search_str != null){
     query={$text : { $search : request.body.search_str }};
  }
  else{
    query={};
  }
dbUtil.getDb().collection("movies").find(query).toArray(function(error, result){
  if (error) {
      console.log("not found");
      response.status(500).json({"error here": error.message});
      return;
  }
  response.status(200).json(result);
  });
});

module.exports = router;
