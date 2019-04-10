$(document).ready(function() {
    var main_url = window.location.protocol + "//" + window.location.host;

    /*-------------------- Entry point for scripts on page --------------------*/
    var initMainPage = function(){
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

        //cart
        $("#cart_icon").on('click', function(){
            $(".cart_modal").show();
        });

        logoutListener();
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
            data: JSON.stringify({"search_str" : search}),//passing the search string to db
            success: function(response){

                if(!response || response.length == 0){
                    return;
                }

                //append html card content to display movie data
                $.each(response,function(i, movie){
                    var html_content = '<div class="col-sm-3 card">' +
                                        '<div class="row">' +
                                        '<img src="images/' + movie._id + '.jpg" alt="movie_image" class="movie_images"/>' +
                                        '</div>' +
                                        '<div class="row description">' +
                                        '<div class="row1"><h3>' + movie.Title.toUpperCase() + '</h3>'+
                                        '<p class="desc"><b>GENRE : </b>' + movie.Genre.join(", ") + '</p>'+
                                        '<p class="desc"><b>RATING : </b>' + movie.Ratings + '</p>'+
                                        '<p class="desc"><b>PRICE : </b>' + movie.Price + '</p></div>'+
                                        '<div class="col-sm-12" style="margin: 3% 0;">'+
                                        '<button type="button" class="btn btn-primary" id="know_more" data-toggle="modal" data-target="#myModal">KNOW MORE...</button></div>'+
                                        '<div class="col-sm-12" style="margin: 3% 0;">'+
                                        '<button type="button" id="addToCart">ADD TO CART</button></div></div></div>';

                    $(".container").find(".right_pane").append(html_content);
                });

                //fetching and displaying values in the modal box on clicking know more button
                $(".description").find("#know_more").each(function(){
                    $(this).on('click', function(){
                        var title= $(this).parent().parent().find(".row1").find("h3").text().toLowerCase();

                        $.each(response, function(i,movie){
                            console.log(movie.Title.toLowerCase() , title);
                            if(movie.Title.toLowerCase()==title){

                                $(".modal-header").find("h2").text(movie.Title);
                                var modal_left_data= $(".modal-body").find(".left_col");
                                modal_left_data.find("img").attr("src","images/"+movie._id+".jpg");
                                modal_left_data.find("p").find("#price_modal").text(movie.Price);
                                modal_left_data.find("p").find("#stock_modal").text(movie.Stock);
                                var td=$(".modal-body").find(".right_col").find(".modal_desc");
                                td.find("#genre").text(movie.Genre);
                                td.find("#released").text(movie.Released);
                                td.find("#rated").text(movie.Rated);
                                td.find("#director").text(movie.Director );
                                td.find("#writer").text(movie.Writer);
                                td.find("#actor").text(movie.Actors);
                                td.find("#plot").text(movie.Plot);
                                td.find("#runtime").text(movie.Runtime);
                                td.find("#ratings").text("N/A");
                                td.find("#language").text(movie.Language);
                                td.find("#country").text(movie.Country);
                                td.find("#awards").text(movie.Awards);
                                td.find("#production").text(movie.Production);
                                td.find("#boxOffice").text(movie.BoxOffice);
                                td.find("#website").text(movie.Website);
                                td.find("a").attr("href", movie.Website);
                            }
                        });
                    });
                });
            },
            error: function(response){
                console.log("Error occured: " + response.responseText);
            }
        });
    };

    initMainPage();
});
