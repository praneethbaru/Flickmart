$(document).ready(function() {
    var main_url = window.location.protocol + "//" + window.location.host;
    var user = null;
    var movie_fields = ["Genre", "Released", "Rated", "Director", "Writer", "Actors", "Plot", "Runtime", "Ratings", "Language", "Country", "Awards", "Production", "BoxOffice", "Website"];
    var movie_item = {};
    var cart=[];
    var newCart = [];
    var count=0;
    var user_cart=null;
    /*-------------------- Entry point for scripts on page --------------------*/
    var initMainPage = function(){
        if(typeof(sessionStorage) != 'undefined' && sessionStorage.getItem("customer")){
            user = JSON.parse(sessionStorage.getItem("customer"));
        }
        var cart_head= '<tr><th> Movie Title </th><th> Quantity </th><th> Price </th><th> Action </th></tr>';
        $("#cart_table").append(cart_head);
        //console.log(user.cart);
        user_cart=user.cart;
        //cart.push(user_cart);
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



        //upon clicking clear
        $(document).on("click", "#clear_cart", function() {
            $.ajax({
                type: "POST",
                url: main_url + "/customer/deletecart",
                data: JSON.stringify({"customer_id": user._id, "cart" : cart}),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function(res){
                    var cart_data;
                    //console.log(res.success);
                    if(res.success){

                        $("#cart_table").empty();
                        count=0;
                        $(".no_of_items").text(count);
                    }

                },//success end
                error: function(response){
                console.log("Error occured: " + response.responseText);
            }// error end
            });//ajax end
        });//click end

        //checkout the cart
        $(document).on("click", "#check_out_cart", function() {
            alert("Checkout the cart ?");
        });


        $('body').on('click', function (e) {
            $('[data-toggle=popover]').each(function () {
                // hide any open popovers when the anywhere else in the body is clicked
                if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                    $(this).popover('hide');
                }
            });
        });//cart end

        //$(".popover_content").find("#cart_table").find("tr").each(function(){
            //$(this).on('click' , function(){
                //console.log($("#popover_content_wrapper").find("#cart_details").find("#cart_table").html());
            //})
        //});





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
            data: JSON.stringify({"search" : search, "page": 1}),
            success: function(response){

                if(!response || response.length == 0){
                    $(".container").find(".right_pane").append("<div>No results found. Try using different criteria.</div>");
                    return;
                }
                var a =0;
                var b=1;
                var c=15;
                //append html card content to display movie data
                $.each(response.data,function(i, movie){
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

                $.each(user_cart, function(i, item){
                    count=user_cart.length;
                    $.each(response.data, function(i, movie){
                        if(item.id==movie._id){
                            //console.log(movie.Stock);
                            cart_data='<tr id="tdata"> <td>'+movie.Title+'</td>'+
                            '<td> <input type="number" name="quantity" min="1" max="'+movie.Stock+'" value='+item.quantity+'></td>'+
                            '<td>'+movie.Price+'</td>'+
                            '<td><a href="#" class="btn btn-default" id="delete_item">'+
                            '<span class="glyphicon glyphicon-trash"></span> Delete</a></tr>';
                            $(".no_of_items").text(count);
                            $("#cart_table").append(cart_data);
                            cart.push(item);
                        }
                    });
                    //
                });
                //fetching and displaying values in the modal box on clicking know more button
                $(".description").find("#know_more").each(function(){
                    $(this).on('click', function(){
                        var id = $(this).parent().parent().find(".row1").find("h3").attr("data-id");

                        $.each(response.data, function(i, movie){
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
                        $.each(response.data, function(i, movie){
                            if(movie._id == id) {
                                //if cart is empty add the element with quantity 1
                                if(cart.length == 0)
                                {
                                    movie_item["id"]=movie._id;
                                    movie_item["quantity"]=1;
                                    cart.push(movie_item);

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

                        //ajax call to insert cart items in database and display in the cart popover
                    $.ajax({
                        type: "POST",
                        url: main_url + "/customer/updatecart",
                        data: JSON.stringify({"customer_id": user._id, "cart" : cart}),
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        success: function(res){
                            var cart_data;
                            $("#cart_table").empty();
                            //add cart header
                            var cart_head= '<tr><th> Movie Title </th><th> Quantity </th><th> Price </th><th> Action </th></tr>';
                            $("#cart_table").append(cart_head);
                            var obj = JSON.parse(JSON.stringify(res)).cart;
                            //display items clicked in the cart popover
                            $.each(obj, function(i, item){
                                count=obj.length;
                                $.each(response.data, function(i, movie){
                                    if(item.id==movie._id){
                                        //console.log(movie.Stock);
                                        cart_data='<tr id="tdata"> <td>'+movie.Title+'</td>'+
                                        '<td> <input type="number" name="quantity" min="1" max="'+movie.Stock+'" value='+item.quantity+'></td>'+
                                        '<td>'+movie.Price+'</td>'+
                                        '<td><a href="#" class="btn btn-default" id="delete_item">'+
                                        '<span class="glyphicon glyphicon-trash"></span> Delete</a></tr>';
                                        $(".no_of_items").text(count);
                                        $("#cart_table").append(cart_data);
                                    }
                                });
                                //
                            });
                        },//success
                        error: function(response){
                        console.log("Error occured: " + response.responseText);

                        }
                    });
                    });//click close
                });//addToCart close

                //upon clicking delete item
                $(document).on("click", "#delete_item", function() {
                    var delete_name= $(this).parent().parent().find("td:eq(0)").text();
                    $.each(response.data, function(i, movie){
                        if(movie.Title==delete_name){


                            $.each(cart, function(i, item){
                                if(item.id == movie._id)
                                {

                                }
                                else
                                newCart.push(item);

                            });
                            cart = newCart;
                            //console.log(newCart);
                            newCart = [];

                            $.ajax({
                                type: "POST",
                                url: "customer/updatecart",
                                data: JSON.stringify({"customer_id": user._id, "cart" : cart}),
                                dataType: "json",
                                contentType: "application/json; charset=utf-8",
                                success: function(res){
                                    //var cart_data;
                                    $("#cart_table").empty();
                                    //add cart header
                                    var cart_head= '<tr><th> Movie Title </th><th> Quantity </th><th> Price </th><th> Action </th></tr>';
                                    $("#cart_table").append(cart_head);
                                    var obj = JSON.parse(JSON.stringify(res)).cart;
                                    console.log(obj.cart);
                                    //display items clicked in the cart popover
                                    $.each(obj, function(i, item){
                                        count=obj.length;
                                        $.each(response.data, function(i, movie){
                                            if(item.id==movie._id){

                                                cart_data='<tr id="tdata"> <td>'+movie.Title+'</td>'+
                                                '<td> <input type="number" name="quantity" min="1" max="'+movie.Stock+'" value='+item.quantity+'></td>'+
                                                '<td>'+movie.Price+'</td>'+
                                                '<td><a href="#" class="btn btn-default" id="delete_item">'+
                                                '<span class="glyphicon glyphicon-trash"></span> Delete</a></tr>';
                                                $(".no_of_items").text(count);
                                                $("#cart_table").append(cart_data);
                                            }
                                        });
                                        //
                                    });

                                },
                                error: function(response){

                                }
                            });
                        }
                    });
                });
            },
            error: function(response){
                console.log("Error occured: " + response.responseText);
                $(".container").find(".right_pane").append("<div>Error occurred. Could not fetch response.</div>");
            }
        });
    };//loadMovies end

    initMainPage();
});
