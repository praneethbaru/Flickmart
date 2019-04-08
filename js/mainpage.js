$(document).ready(function() {
    var main_url = window.location.protocol + "//" + window.location.host;


    /*-------------------- Entry point for scripts on page --------------------*/
    var initMainPage = function(){
      // to display movies data from the db
      var url = main_url + "/movies/getmovies";
      $.ajax({
                  type: "GET",
                  url: url,
                  success: function(movies){
                    console.log("success");
                  },
                  error: function(movies){
                      console.log("Error occured: " + movies.responseText);

                  }
        });

       $("#logout_button").on("click", function(){

            var url = main_url + "/customer/terminate/logout";
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function(response){
                    window.location = main_url + "/index";
                },
                error: function(response){
                    console.log("Error occured: " + response.responseText);
                    window.location = main_url + "/index";
                }
            });
      });
    };

    $("#filter").on("click", function(){
      $(".filter_content").toggle();
    });
    initMainPage();

});
