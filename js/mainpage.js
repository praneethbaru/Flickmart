$(document).ready(function() {



    var main_url = window.location.protocol + "//" + window.location.host;
    // to display movies data from the db
    var url1 = main_url + "/movies/getmovies";



    /*-------------------- Entry point for scripts on page --------------------*/

    var initMainPage = function(){
      var search=null;
      //load the movies on page load
      ajaxFunc(search);
      //load the search results on search btn click
      $("#search_btn").on('click', function(){
        if($("#search").val() == ""){
          search= null;
        }
        else{
          search=$("#search").val();
        }
        //clear before each search to avoid duplicates
      $(".container").find(".right_pane").empty();
        ajaxFunc(search);
      });

      //logout button functionality
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

    //ajax post call to get the data from db
    var ajaxFunc= function(search){
      $.ajax({
                  type: "POST",
                  url: url1,
                  dataType: "json",
                  contentType: "application/json; charset=utf-8",
                  data: JSON.stringify({"search_str" : search}),//passing the search string to db
                  success: function(response){

                    $.each(response,function(i, movie){
                      //append html card content to display movie data
                      var html_content='<div class="col-sm-3 card">'+
                      '<div class="row">'+
                      '<img src="images/'+movie._id+'.jpg" alt="movie_image" class="movie_images"/>'+
                      '</div>'+
                      '<div class="row description">'+
                      '<h3>'+movie.Title.toUpperCase()+'</h3><div class="row1">'+
                      '<p class="desc"><b>GENRE : </b>'+movie.Genre+'</p>'+
                      '<p class="desc"><b>RATING : </b>'+movie.Ratings[0].Value+'</p>'+
                      '<p class="desc"><b>PRICE : </b>'+movie.Price+'</p></div>'+
                      '<div class="col-sm-12" style="margin: 3% 0;">'+
                      '<button type="button" class="btn btn-primary" id="know_more" data-toggle="modal" data-target="#myModal">KNOW MORE...</button></div>'+
                      '<div class="col-sm-12" style="margin: 3% 0;">'+
                      '<button type="button" id="addToCart">ADD TO CART</button></div></div></div>';
                      //append to right pane
                      $(".container").find(".right_pane").append(html_content);
                    });

                    //fetching and displaying values in the modal box on clicking knowmore button
                    $(".description").find("#know_more").each(function(){
                      $(this).on('click', function(){
                        var title= $(this).parent().parent().find(".row1").find("h3").text().toLowerCase();

                        $.each(response, function(i,movie){
                          console.log(movie.Title.toLowerCase() , title);
                          if(movie.Title.toLowerCase()==title){
                            console.log(movie.Title);
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
                          }//if
                        });//each
                      });//onclick
                    });//know more close
                  },
                  error: function(response){
                  }
        });
    };

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



    initMainPage();



});
