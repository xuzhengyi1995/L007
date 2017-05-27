// JavaScript Document
function fill_sid_info(sid) {
    $.ajax({
        type : 'GET',
        url : "/api/student/" + sid,
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                if (data.info != null) {
                    document.getElementById("ac_nom").value = data.info.nom;
                    document.getElementById("ac_prenom").value = data.info.prenom;
                    document.getElementById("ac_adm").value = data.info.admission;
                    document.getElementById("ac_filiere").value = data.info.filiere;

                    document.getElementById("ac_nom").readOnly = true;
                    document.getElementById("ac_prenom").readOnly = true;
                    document.getElementById("ac_adm").readOnly = true;
                    document.getElementById("ac_filiere").readOnly = true;
                } else {
                    document.getElementById("ac_nom").value = '';
                    document.getElementById("ac_prenom").value = '';
                    document.getElementById("ac_adm").value = '';
                    document.getElementById("ac_filiere").value = '';

                    document.getElementById("ac_nom").readOnly = false;
                    document.getElementById("ac_prenom").readOnly = false;
                    document.getElementById("ac_adm").readOnly = false;
                    document.getElementById("ac_filiere").readOnly = false;
                }
            }
        }
    });
};

$(function () {
    $("#ac_sid").change(function () {
        var sid = document.getElementById("ac_sid").value;
        fill_sid_info(sid);
    });

    $.ajax({
        type : 'GET',
        url : "/api/user",
        success : function (data) {
            document.getElementById("ac_uid").value = data.uid;
            document.getElementById("ac_username").value = data.username;
            document.getElementById("ac_email").value = data.email;
            document.getElementById("ac_type").value = data.type;

            document.getElementById("ac_uid").readOnly = true;
            document.getElementById("ac_username").readOnly = true;
            document.getElementById("ac_email").readOnly = true;
            document.getElementById("ac_type").readOnly = true;
            if (data.sid != null) {
                document.getElementById("ac_sid").value = data.sid;
                fill_sid_info(data.sid);
            }
        }
    });
});

function ac_change_sid() {
    data = {};
    r_key = document.getElementById("key").value;
    data.key = r_key;
    data.sid = (document.getElementById("ac_sid").value);
    data.nom = (document.getElementById("ac_nom").value).toUpperCase();
    data.prenom = (document.getElementById("ac_prenom").value);
    data.admission = (document.getElementById("ac_adm").value).toUpperCase();
    data.filiere = (document.getElementById("ac_filiere").value).toUpperCase();

    $.ajax({
        type : 'PUT',
        url : "/api/user",
        contentType : "application/json",
        data : JSON.stringify(data),
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert("Successed!");
                account_info();
            }
        }
    });
}
