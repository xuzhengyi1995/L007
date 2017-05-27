// JavaScript Document
function staff_search() {
    var s = document.getElementById("s_type").value;
    var key = document.getElementById("s_keyw").value;
    if (key === '') {
        var url = "/api/cursus/";
    } else {
        var url = "/api/cursus/" + s + "/" + key;
    }
    $.get('tables.html', '', function (result) {
        $('#page-wrapper').html(result);
        display_table(url);
    });
}
