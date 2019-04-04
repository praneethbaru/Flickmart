/* Customer routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const ObjectId = require('mongodb').ObjectId;

// Get customers with id endpoint
router.get('/:customerId', function(request, response, next) {
    var customerId = request.params.customerId;
    if(customerId == null || !ObjectId.isValid(customerId)) {
        response.status(500).json({
            "error": "Customer id is invalid."
        });
        return;
    }

    var query = { _id: ObjectId(customerId) };
    dbUtil.getDb().collection("customer").findOne(query, function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }

        response.status(200).json(result);
    });
});

// Create customer on register endpoint
router.post('/insert', function(request, response, next){
    var customerObj = request.body;

    if(!customerObj){
        response.status(500).json({
            "error": "Customer document invalid."
        });
        return;
    }

    dbUtil.getDb().collection("customer").insertOne(customerObj, function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }

        response.status(200).json({"success": result.insertedCount + " document(s) inserted"});
    });
});

// Check if customer email exists
router.get('/checkemail/:customerEmail', function(request, response, next) {
    var customerEmail = request.params.customerEmail;
    if(customerEmail == null) {
        response.status(500).json({
            "error": "Customer email not valid."
        });
        return;
    }

    var query = { "email": customerEmail };
    dbUtil.getDb().collection("customer").findOne(query, function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }

        var found = true;
        if(!result){
            found = false;
        }

        response.status(200).json({"found": found});
    });
});

// Customer login check
router.get('/login/:customerEmail/:customerPassword', function(request, response, next) {
    var customerEmail = request.params.customerEmail;
    var customerPassword = request.params.customerPassword;

    if(customerEmail == null || customerPassword == null) {
        response.status(500).json({
            "error": "Customer email or password not valid."
        });
        return;
    }

    var query = { "email": customerEmail };
    dbUtil.getDb().collection("customer").findOne(query, function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }

        if(!result){
            response.status(500).json({"error": "Customer not found."});
            return;
        }

        var responseObj = {};
        if(result.password.trim() == customerPassword.trim()){
            responseObj['success'] = true;
        }
        else{
            responseObj['success'] = false;
        }

        response.status(200).json(responseObj);
    });
});

module.exports = router;
