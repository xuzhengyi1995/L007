// JavaScript Document
function reg_check_email() {
    if (!is_email(document.getElementById("email").value)) {
        $('#div_e').addClass('has-error');
        document.getElementById("e_error").innerHTML = "<strong>Email error!</strong>";
        document.getElementById("e_error").removeAttribute("hidden");
    } else {
        document.getElementById("e_error").setAttribute("hidden", true);
        $('#div_e').removeClass('has-error');
    }
}

function reg_check_username_length(str) {
    username = document.getElementById("username").value;
    if ((username.length <= 5) || (username.length > 20)) {
        return false;
    } else {
        return true;
    }
}

function reg_check_username() {
    if (!reg_check_username_length()) {
        $('#div_u').addClass('has-error');
        document.getElementById("e_error").innerHTML = "<strong>Length of username must in 6~20!</strong>";
        document.getElementById("e_error").removeAttribute("hidden");
    } else {
        document.getElementById("e_error").setAttribute("hidden", true);
        $('#div_u').removeClass('has-error');
    }
}

function reg_check_pwd_length() {
    pwd = document.getElementById("pwd").value;
    if ((pwd.length < 6) || (pwd.length > 20)) {
        return false;
    } else {
        return true;
    }
}

function reg_check_pwd() {
    if (!reg_check_pwd_length()) {
        $('#div_p').addClass('has-error');
        document.getElementById("e_error").innerHTML = "<strong>Length of password must in 6~20!</strong>";
        document.getElementById("e_error").removeAttribute("hidden");
    } else {
        document.getElementById("e_error").setAttribute("hidden", true);
        $('#div_p').removeClass('has-error');
    }
}

function reg_rpwd_check() {
    pwd = document.getElementById("pwd").value;
    rpwd = document.getElementById("rpwd").value;
    if (pwd != rpwd) {
        return false;
    } else {
        return true;
    }
}

function reg_check_rpwd() {
    if (!reg_rpwd_check()) {
        $('#div_rp').addClass('has-error');
        document.getElementById("e_error").innerHTML = "<strong>Passwod is not same.</strong>";
        document.getElementById("e_error").removeAttribute("hidden");
    } else {
        document.getElementById("e_error").setAttribute("hidden", true);
        $('#div_rp').removeClass('has-error');
    }
}

function reg_set_err_info(str) {
    switch (str) {
    case "ERROR_EMAIL_ALREADY_HAVE":
        document.getElementById("err_info").innerHTML = "Email already exist!";
        break;
    case "ERROR_NO_ENOUGH_INFO":
        document.getElementById("err_info").innerHTML = "Please complet all the information necessary.";
        break;
    case "ERROR_CANT_FIND_USER":
        document.getElementById("err_info").innerHTML = "Email adresse or password wrong";
        break;
    case "ERROR_WRONG_PASSWORD":
        document.getElementById("err_info").innerHTML = "Email adresse or password wrong";
        break;
    case "ERROR_CREAT_USER_FAILED":
        document.getElementById("err_info").innerHTML = "Creat new user fail, please check your informtion";
        break;
    case "ERROR_CHECK_BOOT":
        document.getElementById("err_info").innerHTML = "Robot is not allowed";
        break;
    }
}

function reg_on_creat_account() {
    if (!is_email(document.getElementById("email").value)) {
        $('#div_e').addClass('has-error');
        shake("email");
        document.getElementById("email").focus();

        return false;
    }
    if (!reg_check_username_length()) {
        $('#div_u').addClass('has-error');
        shake("username");
        document.getElementById("username").focus();
        return false;
    }
    if (document.getElementById("pwd").value == '') {
        $('#div_p').addClass('has-error');
        shake("pwd");
        document.getElementById("pwd").focus();
        return false;
    }
    if (!reg_check_pwd_length()) {
        $('#div_p').addClass('has-error');
        shake("rpwd");
        document.getElementById("pwd").focus();
        return false;
    }
    if (!reg_rpwd_check()) {
        $('#div_rp').addClass('has-error');
        shake("rpwd");
        document.getElementById("rpwd").focus();
        return false;
    }
    //check same email
    document.getElementById("pwd").value = sha512(document.getElementById("pwd").value);
    document.getElementById("rpwd").value = sha512(document.getElementById("rpwd").value);
    document.getElementById("pwd").setAttribute("readonly", true);
    document.getElementById("rpwd").setAttribute("readonly", true);
    document.getElementById("email").setAttribute("readonly", true);
    document.getElementById("username").setAttribute("readonly", true);
    document.getElementById("email").setAttribute("readonly", true);
    document.getElementById("type").setAttribute("readonly", true);

    $("#_reg_btn").button("loading").delay(1000).queue(function () {

        $.post("/api/creat_user/check_email/", $('form').serialize(), function (result) {
            data = result;
            if (data.is_error) {
                reg_set_err_info(data.error_info);
                document.getElementById("error").removeAttribute("hidden");
            } else {
                $.post("/api/creat_user/creat/", $('form').serialize(), function (result) {
                    data = result;
                    if (data.is_error) {
                        reg_set_err_info(data.error_info);
                        document.getElementById("error").removeAttribute("hidden");
                    } else {
                        alert('Successfully! Uid: ' + data.uid + '  Welcome ' + data.username + '!');
                        window.location.href = "index.php"
                    }
                });
            }
        });
    });
}

function reg_clear_error() {
    grecaptcha.reset();
    document.getElementById("pwd").value = '';
    document.getElementById("rpwd").value = '';

    document.getElementById("pwd").removeAttribute("readonly");
    document.getElementById("rpwd").removeAttribute("readonly");
    document.getElementById("email").removeAttribute("readonly");
    document.getElementById("username").removeAttribute("readonly"); ;
    document.getElementById("email").removeAttribute("readonly");
    document.getElementById("type").removeAttribute("readonly");

    document.getElementById("error").setAttribute("hidden", true);
    $("#_reg_btn").button('reset');
    $("#_reg_btn").dequeue();
}
