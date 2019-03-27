$(document).ready(function(){
//animations on clicking register
$("#register_link").click(function(){
  $(".login").removeClass("flipInY delay-1s").addClass("animated flipOutY");
  $(".register").show();
  $(".register").removeClass("flipOutY").addClass("animated flipInY delay-1s");
});
//animations on clicking login_link buttton
$("#login_link").click(function(){
  $(".register").removeClass("flipInY delay-1s").addClass("flipOutY");
  $(".login").show();
  $(".login").removeClass("flipOutY").addClass("flipInY delay-1s");
});

$("#name").parent().append('<tr><td><span class="error1">Name cannot be empty</span></td></tr>');
$(".error1").addClass("error");
//name validations
$("#name").on('blur', function() {
var name=$('#name').val();
if(name==""){
 $(".error1").show();
}else if(name!=""){
//$("span").remove();
$(".error1").hide();
}
});

//email validations
$("#email").parent().append('<tr><td><span class="error2">Email cannot be empty</span></td></tr>');
$(".error2").addClass("error");
$("#email").on('blur', function() {
var email=$("#email").val();
if(email==""){
 $(".error2").show();
}else if(email!=""){
$(".error2").hide();
}
});

//username validations
$("#rusername").parent().append('<tr><td><span class="error3">Username cannot be empty</span></td></tr>');
$(".error3").addClass("error");
$("#rusername").on('blur', function() {
  var regex2 = /^^[a-zA-Z0-9]*$/i;
  var username=$("#rusername").val();
  var validUN= regex2.test(username);
if(username==""){
 $(".error3").show();
}
else if(username!=""){
    $(".error3").hide();
  }

});

//pwd validations
$("#rpassword").parent().append('<tr><td><span class="error4">Password cannot be empty</span></td></tr>');
$(".error4").addClass("error");
$("#rpassword").on('blur', function() {
var pwd=$("#rpassword").val();
if(pwd==""){
 $(".error4").show();
}else if(pwd!=""){
$(".error4").hide();
}
});

//confirm pwd validations
$("#cpassword").parent().append('<tr><td><span class="error5">Confirm Password cannot be empty</span></td></tr>');
$(".error5").addClass("error");
$("#cpassword").on('blur', function() {
var cpwd=$("#cpassword").val();
if(cpwd==""){
 $(".error5").show();
}else if(cpwd!=""){
$(".error5").hide();
}
});

$("#login_link").on('click',function(){
$(".error").hide();$('.reg_input').val('');
});
});//ready
