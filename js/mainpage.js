$(document).ready(function() {
    var main_url = window.location.protocol + "//" + window.location.host;

    /*-------------------- Entry point for scripts on page --------------------*/
    var initMainPage = function(){

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

    initMainPage();

});
