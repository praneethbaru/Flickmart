$(document).ready(function() {
    var main_url = window.location.protocol + "//" + window.location.host;
    var user = null;
    var movie_fields = ["Genre", "Released", "Rated", "Director", "Writer", "Actors", "Plot", "Runtime", "Ratings", "Language", "Country", "Awards", "Production", "BoxOffice", "Website"];
    var movie_item = {};
    var cart=[];
    /*-------------------- Entry point for scripts on page --------------------*/
    var initMainPage = function(){
        if(typeof(sessionStorage) != 'undefined' && sessionStorage.getItem("customer")){
            user = JSON.parse(sessionStorage.getItem("customer"));
        }
        //console.log(user);
        loadMovies(null);
        addEventListeners();
    };

    /*-------------------- Adds all event listeners on page --------------------*/
    var addEventListeners = function() {
        //load the search results on search btn click
        $("#search_btn").on('click', function(){
            if($("#search").val().trim() == ""){
                search = null;
            }
            else{
                search = $("#search").val();
            }

            $(".container").find(".right_pane").empty();
            loadMovies(search);
        });

        //slider input for ratings
        $("#ratings_range").on('input', function(){
            var value = $(this).val();
            $("#rating_value").text(value);
        });
        //slider input for year
        $("#year_range").on('input', function(){
            var value = $(this).val();
            $("#year_value").text(value);
        });
        //filter drop down
        $("#filter").on("click", function(){
            $(".filter_content").toggle();
        });

        cartListeners();
        logoutListener();
    };

    var cartListeners = function(){
        //cart
        $('#cart-popover').popover({
            html : true,
            container: 'body',
            content:function(){
                return $('#popover_content_wrapper').html();
            }
        });

        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                // hide any open popovers when the anywhere else in the body is clicked
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });//cart end
    };

    /*-------------------- Logout button listener --------------------*/
    var logoutListener = function(){
        $("#logout_button").on("click", function(){
            var url = main_url + "/customer/terminate/logout";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(response){
                    sessionStorage.clear();
                    window.location = main_url + "/index";
                },
                error: function(response){
                    console.log("Error occured: " + response.responseText);
                    sessionStorage.clear();
                    window.location = main_url + "/index";
                }
            });
        });
    };

    /*-------------------- Loads movies from database based on criteria --------------------*/
    var loadMovies = function(search){
        var url = main_url + "/movies/getmovies";

        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"search" : search}),
            success: function(response){

                if(!response || response.length == 0){
                    $(".container").find(".right_pane").append("<div>No results found. Try using different criteria.</div>")
                    return;
                }
                var a =0;
                var b=1;
                var c=15;
                //append html card content to display movie data
                $.each(response,function(i, movie){
                    var html_content = '<div class="col-sm-3 card">' +
                                        '<div class="row">' +
                                        '<img src="images/' + movie._id + '.jpg" alt="movie_image" class="movie_images"/>' +
                                        '</div>' +
                                        '<div class="row description">' +
                                        '<div class="row1"><h3 data-id="' + movie._id + '">' + movie.Title.toUpperCase() + '</h3>'+
                                        '<p class="desc"><b>GENRE : </b>' + movie.Genre.join(", ") + '</p>'+
                                        '<p class="desc"><b>RATING : </b>' + movie.Ratings.toFixed(2) + '</p>'+
                                        '<p class="desc"><b>PRICE : </b>$' + movie.Price.toFixed(2) + '</p></div>'+
                                        '<div class="col-sm-12" style="margin: 3% 0;">'+
                                        '<button type="button" class="btn btn-primary" id="know_more" data-toggle="modal" data-target="#myModal">KNOW MORE...</button></div>'+
                                        '<div class="col-sm-12" style="margin: 3% 0;">'+
                                        '<button type="button" id="addToCart">ADD TO CART</button></div></div></div>';

                    $(".container").find(".right_pane").append(html_content);

                });
                //fetching and displaying values in the modal box on clicking know more button
                $(".description").find("#know_more").each(function(){
                    $(this).on('click', function(){
                        var id = $(this).parent().parent().find(".row1").find("h3").attr("data-id");

                        $.each(response, function(i, movie){
                            if(movie._id == id) {
                                $(".modal-header").find("h2").text(movie.Title);
                                var modal_left_data= $(".modal-body").find(".left_col");
                                modal_left_data.find("img").attr("src","images/" + movie._id + ".jpg");
                                modal_left_data.find("p").find("#price_modal").text("$" + movie.Price.toFixed(2));
                                modal_left_data.find("p").find("#stock_modal").text(movie.Stock);
                                var td_content = $("<tbody></tbody>");

                                $.each(movie_fields, function(index, field){
                                    if(!movie[field] || movie[field] == "" || ($.isArray(movie[field]) && movie[field].length == 0)){
                                        return;
                                    }

                                    if($.isArray(movie[field])) {
                                        td_content.append('<tr><th>' + field + ' : </th><td>' + movie[field].join(", ") + '</td></tr>');
                                    }
                                    else if(field == "Website") {
                                        td_content.append('<tr><th>' + field + ' : </th><td><a target="_blank" href="' + movie[field] + '">' + movie[field] + '</td></tr>');
                                    }
                                    else {
                                        td_content.append('<tr><th>' + field + ' : </th><td>' + movie[field] + '</td></tr>');
                                    }
                                });

                                $(".modal-body").find(".right_col").find(".modal_desc").empty().append(td_content);
                            }
                        });
                    });
                });

                //fetching and displaying values in the modal box on clicking addToCart button and store in db
                $(".description").find("#addToCart").each(function(){
                    $(this).on('click', function(){
                        var id = $(this).parent().parent().find(".row1").find("h3").attr("data-id");
                        $.each(response, function(i, movie){
                            if(movie._id == id) {
                                //if cart is empty add the element with quantity 1
                                if(cart.length == 0)
                                {
                                    movie_item["id"]=movie._id;
                                    movie_item["quantity"]=1;
                                    //movie_item.count=1;
                                    cart.push(movie_item);
                                    //console.log(JSON.stringify(cart));
                                }
                                //if cart is not empty and if item is laready in the cart
                                else
                                {
                                    var cart_item_already_exists = false;
                                    var rep_id;
                                    //check if the movie already exists
                                    $.each(cart, function(j, item){
                                        if(item.id == movie._id){
                                            cart_item_already_exists = true;
                                            rep_id = j;
                                            return false;
                                        }
                                        else {
                                            cart_item_already_exists = false;
                                            return true;
                                        }
                                    });
                                    //if item exists update cart quantity
                                    if(cart_item_already_exists){
                                        cart[rep_id].quantity++;
                                        //console.log(JSON.stringify(cart));
                                        //cart[rep_id].count++;
                                    }
                                    //if item is not in the cart add to cart
                                    else {
                                        movie_item = {};
                                        movie_item["id"]=movie._id;
                                        movie_item["quantity"]=1;
                                        //movie_item.count=1;

                                        cart.push(movie_item);
                                        //console.log(cart);
                                    }
                                }

                            }//movie match close
                        });


                    $.ajax({
                        type: "POST",
                        url: main_url + "/customer/insertcart",

                        data: JSON.stringify({"customer_id": user._id, "cart" : cart}),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function(response){

                        console.log("The response is "+response.responseText);
                        },
                        error: function(response){
                        console.log("Error occured: " + response.responseText);

                        }
                    });
                        //console.log(JSON.parse(JSON.stringify(cart)).length);
                    });//click close
                });//addToCart close
            },
            error: function(response){
                console.log("Error occured: " + response.responseText);
            }
        });
    };

    initMainPage();
});
