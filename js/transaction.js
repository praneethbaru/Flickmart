$(document).ready(function() {

  $("#test").click(function(){
    $("#myModal").addClass("active");
     });

  $(".closeModal").click(function(){
    $(".modal").removeClass("active");
  });
});//ready
