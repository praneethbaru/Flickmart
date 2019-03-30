/* Customer routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const ObjectId = require('mongodb').ObjectId;

// Get customers with id
router.get('/:customerId', function(request, response, next) {
    var customerId = request.params.customerId;
    if(customerId == null || !ObjectId.isValid(customerId)) {
        response.status(200).json({
            "error": "Customer id is invalid."
        });
        return;
    }

    var query = { _id: ObjectId(customerId) };
    dbUtil.getDb().collection("customer").findOne(query, function(error, result) {
        if (error) {
            throw error;
        }

        response.status(200).json(result);
    });


});

module.exports = router;
