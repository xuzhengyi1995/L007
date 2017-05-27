// JavaScript Document
function index_search_nom() {
    $.get('welcome.php', '', function (result) {
        $('#page-wrapper').html(result);
        var key = document.getElementById("index_search_input").value;
        if (key === '') {
            url = '/api/cursus';
        } else {
            url = '/api/cursus/nom/' + key;
        }
        display_table(url);
    });

}
function log_out() {
    $.get('/api/logout/', '', function (result) {
        data = result;
        if (data.ok) {
            alert('You have logged out.');
            window.location.href = "index.php"
        }
    });
}
function index_search_ue() {
    var filiter = '/' + document.getElementById("s_UE").value;
    index_get_ue(filiter);

}
function index_get_ue(filiter) {
    $.get('cours.html', '', function (result) {
        $('#page-wrapper').html(result);
        cours_list_cours(filiter);
    });
}
function index_avg() {
    $.get('avg_point.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
function account_info() {
    $.get('account.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
function index_sum() {
    $.get('sum_credit.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
function index_add_rules() {
    $.get('rules_import_csv.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
function index_add_cours() {
    $.get('add_cours.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
function log_in() {
    $.get('_login.html', '', function (result) {
        $('#page-wrapper').html(result);
        grecaptcha.render($('.g-recaptcha')[0], {
            sitekey : '6Lc8VB8UAAAAALdtNz2WMR9K2crxaq-UXrNaHm4V'
        });
    });
}

function new_account() {
    $.get('reg.html', '', function (result) {
        $('#page-wrapper').html(result);
        grecaptcha.render($('.g-recaptcha')[0], {
            sitekey : '6Lc8VB8UAAAAALdtNz2WMR9K2crxaq-UXrNaHm4V'
        });
    });
}

function cursus_general() {
    document.getElementById("index_search_input").value = '';
    index_search_nom();
}

function import_csv() {
    $.get('import_csv.html', '', function (result) {
        $('#page-wrapper').html(result);
    });
}
