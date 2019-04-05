module.exports = function(request, response, next) {
    if (request.session && request.session.user && request.session.role) {
        return next();
    }
    else {
        //return response.status(401).send('ERROR: Unauthorized access to resource.');
        return response.redirect('/index');
    }
};
