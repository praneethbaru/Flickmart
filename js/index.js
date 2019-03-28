$(document).ready(function() {
/*-------------------- Animations on clicking register button --------------------*/
    $("#register_link").click(function() {
        $(".login").removeClass("flipInY delay-1s").addClass("animated flipOutY");
        $(".register").show();
        $(".register").removeClass("flipOutY").addClass("animated flipInY delay-1s");
    });

/*-------------------- Animations on clicking back_to_login buttton --------------------*/
    $("#back_to_login").click(function() {
        $(".register").removeClass("flipInY delay-1s").addClass("flipOutY");
        $(".login").show();
        $(".login").removeClass("flipOutY").addClass("flipInY delay-1s");
    });

    $("#name").parent().append('<tr><td><span class="error_name"></span></td></tr>');
    $(".error_name").addClass("error");

/*-------------------- Name Validation --------------------*/
    $("#name").on('blur', function() {
        var regex_name = /^^[a-zA-Z]*$/i;
        var name = $('#name').val();
        var valid = regex_name.test(name);
        if (name == "") {
            $(".error_name").text("Name cannot be empty");
            $(".error_name").show();
        } else if (!valid) {
            $(".error_name").text("Name cannot contain numbers");
            $(".error_name").show();
        } else {
            $(".error_name").remove();
            $(".error_name").hide();
        }
    });

/*-------------------- Email validation --------------------*/
    $("#email").parent().append('<tr><td><span class="error_email"></span></td></tr>');
    $(".error_email").addClass("error");
    $("#email").on('blur', function() {
        var regex_email = /^[\w-]+@([\w-]+\.)+[\w-]+$/i;
        var email = $("#email").val();
        var valid = regex_email.test(email);
        if (email == "") {
            $(".error_email").text("Email cannot be empty");
            $(".error_email").show();
        } else if (!valid) {
            $(".error_email").text("Invalid email address");
            $(".error_email").show();
        } else {
            $(".error_email").hide();
        }
    });

/*-------------------- Username Validation --------------------*/
    $("#rusername").parent().append('<tr><td><span class="error_username">Username cannot be empty</span></td></tr>');
    $(".error_username").addClass("error");
    $("#rusername").on('blur', function() {
        var username = $("#rusername").val();
        if (username == "") {
            $(".error_username").show();
        } else if (username != "") {
            $(".error_username").hide();
        }
    });

/*-------------------- Password Validation --------------------*/
    $("#rpassword").parent().append('<tr><td><span class="error_rpwd">Password cannot be empty</span></td></tr>');
    $(".error_rpwd").addClass("error");
    $('#password-strength-meter').hide();
    $("#rpassword").on('input', function() {
        $(".error_rpwd").hide();
        var pwd = $("#rpassword").val();
        $('#password-strength-meter').show();
        var meter = $('#password-strength-meter').val();
        var strength = zxcvbn(pwd);
        var value = strength.score;
        $('#password-strength-meter').attr("value", value);
        if (pwd != "") {
            $('#password-strength-text').show().html('<p>' + strength.feedback.suggestions + '</p>').addClass("error");
        }
        if (pwd == "") {
            $('#password-strength-meter').hide();
            $('#password-strength-text').hide();
        }
    });

    $("#rpassword").on('blur', function() {
        var pwd = $("#rpassword").val();
        if (pwd == "") {
            $('#password-strength-meter').hide();
            $('#password-strength-text').hide();
            $(".error_rpwd").show();
        } else if (pwd != "") {
            $('#password-strength-meter').hide();
            $(".error_rpwd").hide();
        }
    });

/*-------------------- Confirm Password Validation --------------------*/
    $("#cpassword").parent().append('<tr><td><span class="error_cpwd"></span></td></tr>');
    $(".error_cpwd").addClass("error");
    $("#cpassword").on('blur', function() {
        var cpwd = $("#cpassword").val();
        if (cpwd == "") {
            $(".error_cpwd").text("Confirm Password cannot be empty");
            $(".error_cpwd").show();
        } else {
            $(".error_cpwd").hide();
        }
    });
    $("#cpassword").on('input', function() {
        var pwd = $("#rpassword").val();
        var cpwd = $("#cpassword").val();
        if (cpwd != "" && cpwd != pwd) {
            $(".error_cpwd").text("Passwords do not match");
            $(".error_cpwd").show();
        } else {
            $(".error_cpwd").hide();
        }
    });
    $("#back_to_login").on('click', function() {
        $(".error").hide();
        $('.reg_input').val('');
    });
}); //ready
