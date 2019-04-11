/* Movie routes file */

const express = require('express');
const router = express.Router();
const dbUtil = require('./../mongoDbUtil');
const auth = require('./../authUtil');

// Get movies endpoint with search, filter, pagination and sort
router.post('/getmovies', auth, function(request, response, next) {
    var query = [];

    if(!request.body || !request.body.page) {
        response.status(500).json({"error": "Page number not received."});
        return;
    }

    // Adding search term to query
    if(request.body.search) {
        query.push({ $text : { $search : request.body.search } });
    }

    // Adding filters to query
    if(request.body.filters) {
        for(var i = 0; i < request.body.filters.length; i++) {
            var filter_name = request.body.filters[i]['name'];
            var filter_values = request.body.filters[i]['values'];
            var filter_obj = {};
            filter_obj[filter_name] = { $in: filter_values };
            query.push(filter_obj);
        }
    }

    // If empty query, find all
    if(query.length == 0) {
        query.push({});
    }

    var sort = {};
    // Get sort field and order
    if(request.body.sort_field) {
        sort[request.body.sort_field] = request.body.sort_order ? request.body.sort_order : -1;
    }
    else {
        // Default sort by Ratings in descending order
        sort["Ratings"] = request.body.sort_order ? request.body.sort_order : -1;
    }

    // Get result paginated data
    dbUtil.getDb().collection("movies").find({ $and: query }, { "skip": (request.body.page-1) * process.env.page_size, "limit": parseInt(process.env.page_size) }).sort(sort).toArray(function(error, result) {
        if (error) {
            response.status(500).json({"error": error.message});
            return;
        }

        // Get count of data
        dbUtil.getDb().collection("movies").aggregate([{ $match: { $and: query } }, { $group: { _id: null, count: { $sum: 1 } } }], function(countErr, countResult) {
            if (countErr) {
                response.status(500).json({"error": countErr.message});
                return;
            }

            if (!countResult) {
                response.status(500).json({"error": "Error fetching count."});
                return;
            }

            // Reading count aggregate
            countResult.get(function(aggErr, aggRes) {
                if (aggErr) {
                    response.status(500).json({"error": aggErr.message});
                    return;
                }

                if(!aggRes || !aggRes.length || !result.length) {
                    response.status(200).json({
                        data: result,
                        total: 0,
                        current_page: request.body.page,
                        page_size: parseInt(process.env.page_size),
                        total_pages: 0,
                        current_total: result.length,
                        filters: null
                    });
                    return;
                }

                if(request.body.page == 1) {

                    // Fetch aggregates for filter options
                    dbUtil.getDb().collection("movies").aggregate([{ $match: { $and: query } }, {$unwind:"$Country"}, {$unwind:"$Genre"}, {$unwind:"$Rated"}, {$unwind:"$Language"}, {$group : {_id : null, "countries" : {$addToSet : "$Country"}, "rated" : {$addToSet : "$Rated"}, "languages" : {$addToSet : "$Language"}, "genres" : {$addToSet : "$Genre"}}}], function(filterErr, filterResult) {
                        if (filterErr) {
                            response.status(500).json({"error": filterErr.message});
                            return;
                        }

                        if (!filterResult) {
                            response.status(500).json({"error": "Error fetching filter aggregations."});
                            return;
                        }

                        // Reading filters aggregate
                        filterResult.get(function(aggFilterErr, aggFilterRes) {
                            if (aggFilterErr) {
                                response.status(500).json({"error": aggFilterErr.message});
                                return;
                            }

                            if(!aggFilterRes || !aggFilterRes.length) {
                                response.status(200).json({
                                    data: result,
                                    total: aggRes[0].count,
                                    current_page: request.body.page,
                                    page_size: parseInt(process.env.page_size),
                                    total_pages: Math.ceil(aggRes[0].count / parseInt(process.env.page_size)),
                                    current_total: result.length,
                                    filters: null
                                });
                                return;
                            }

                            response.status(200).json({
                                data: result,
                                total: aggRes[0].count,
                                current_page: request.body.page,
                                page_size: parseInt(process.env.page_size),
                                total_pages: Math.ceil(aggRes[0].count / parseInt(process.env.page_size)),
                                current_total: result.length,
                                filters: aggFilterRes[0]
                            });
                        });
                    });

                }
                else {
                    response.status(200).json({
                        data: result,
                        total: aggRes[0].count,
                        current_page: request.body.page,
                        page_size: parseInt(process.env.page_size),
                        total_pages: Math.ceil(aggRes[0].count / parseInt(process.env.page_size)),
                        current_total: result.length
                    });
                }
            });
        });
    });
});

module.exports = router;
