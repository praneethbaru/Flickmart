/* Customer routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const authUtil = require('./../authUtil');
const bcrypt = require('bcrypt');
const ObjectId = require('mongodb').ObjectId;

// Get customers with id endpoint
router.get('/:customerId', authUtil, function(request, response, next) {
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

    bcrypt.hash(customerObj.password, 2, function(err, hash) {
        if(err){
            response.status(500).json({"error": err.message});
            return;
        }

        customerObj.password = hash;

        dbUtil.getDb().collection("customer").insertOne(customerObj, function(error, result) {
            if (error) {
                response.status(500).json({"error": error.message});
                return;
            }

            response.status(200).json({"success": result.insertedCount + " document(s) inserted"});
        });
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
router.post('/login', function(request, response, next) {
    var customerEmail = request.body.email;
    var customerPassword = request.body.password;

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

        bcrypt.compare(customerPassword, result.password, function(err, res) {
            if (err) {
                response.status(500).json({"error": err.message});
                return;
            }

            if(res){
                request.session.user = result.email;
                request.session.role = result.role;
                response.status(200).json({"success": true});
            }
            else{
                response.status(200).json({"success": false});
            }
        });
    });
});

// Customer logout
router.get('/terminate/logout', function(request, response, next) {
    if(request.session){
        request.session.destroy();
    }
    response.status(200).json({"success": true});
});

module.exports = router;
