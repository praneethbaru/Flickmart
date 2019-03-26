$(document).ready(function(){

$("#register_link").click(function(){
  $(".login").removeClass("flipInY delay-1s").addClass("animated flipOutY");
  $(".register").show();
  $(".register").removeClass("flipOutY").addClass("animated flipInY delay-1s");
});

$("#login_link").click(function(){
  $(".register").removeClass("flipInY delay-1s").addClass("flipOutY");
  $(".login").show();
  $(".login").removeClass("flipOutY").addClass("flipInY delay-1s");
});


});//ready
