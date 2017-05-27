function import_check_import(i_url) {
    r_key = document.getElementById("key").value;
    i_url += '?key=' + r_key;
    $("#import_btn").button("loading").delay(1000).queue(function () {
        var data = new FormData();
        jQuery.each(jQuery('#csv')[0].files, function (i, file) {
            data.append('csv', file);
        });
        $.ajax({
            url : i_url,
            type : "POST",
            data : data,
            contentType : false,
            processData : false,
            cache : false,
            xhrFields : {
                withCredentials : true
            },
            enctype : "multipart/form-data",
            success : function (result) {
                data = result;
                if (data.is_error) {
                    document.getElementById("err_info").innerHTML = get_error_info(data.error_info);
                    document.getElementById("error").removeAttribute("hidden");
                } else {
                    alert('File upload success!' + data.num_eles + " element is recorded and the cursus got No." + data.cid + ".");
                    cursus_general();
                }
            },
            error : function (data) {
                document.getElementById("err_info").innerHTML = get_error_info(data.responseJSON.error_info);
                document.getElementById("error").removeAttribute("hidden");
            }

        });
    });
}

function import_clear_error() {
    document.getElementById("error").setAttribute("hidden", true);
    document.getElementById("csv").value = '';
    $("#import_btn").button('reset');
    $("#import_btn").dequeue();

}
