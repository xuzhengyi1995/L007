// JavaScript Document


$(function () {
    $("#cursus_tmp_sid").change(function () {
        var sid = document.getElementById("cursus_tmp_sid").value;
        $.ajax({
            type : 'GET',
            url : "/api/student/" + sid,
            success : function (data) {
                if (data.is_error) {
                    alert(data.error_info);
                } else {
                    if (data.info != null) {
                        document.getElementById("cursus_tmp_nom").value = data.info.nom;
                        document.getElementById("cursus_tmp_prenom").value = data.info.prenom;
                        document.getElementById("cursus_tmp_adm").value = data.info.admission;
                        document.getElementById("cursus_tmp_filiere").value = data.info.filiere;

                        document.getElementById("cursus_tmp_nom").readOnly = true;
                        document.getElementById("cursus_tmp_prenom").readOnly = true;
                        document.getElementById("cursus_tmp_adm").disabled = true;
                        document.getElementById("cursus_tmp_filiere").disabled = true;
                    } else {
                        document.getElementById("cursus_tmp_nom").value = '';
                        document.getElementById("cursus_tmp_prenom").value = '';
                        document.getElementById("cursus_tmp_adm").value = '';
                        document.getElementById("cursus_tmp_filiere").value = '';

                        document.getElementById("cursus_tmp_nom").readOnly = false;
                        document.getElementById("cursus_tmp_prenom").readOnly = false;
                        document.getElementById("cursus_tmp_adm").disabled = false;
                        document.getElementById("cursus_tmp_filiere").disabled = false;
                    }
                }
            }
        });
    });
});

function add_new_cursus_before() {
    $("#new_cursus_add_save_btn").unbind();

    $("#new_cursus_add_save_btn").click(function () {
        data = {};
        data.sid = (document.getElementById("cursus_tmp_sid").value);
        data.nom = (document.getElementById("cursus_tmp_nom").value).toUpperCase();
        data.prenom = (document.getElementById("cursus_tmp_prenom").value);
        data.admission = (document.getElementById("cursus_tmp_adm").value);
        data.filiere = (document.getElementById("cursus_tmp_filiere").value);
        data.type = document.getElementById("cursus_tmp_type").value;

        data_to_save = JSON.stringify(data);
        add_new_cursus(data_to_save);
        $("#addCursusModal").modal('hide');
    });

    $("#addCursusModal").modal('toggle');
}

function add_new_cursus(data) {
    r_key = document.getElementById("key").value;
    p_data = '{"key":"' + r_key + '", "method":"add","data":' + data + '}';

    $.ajax({
        type : 'POST',
        url : "/api/cursus",
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Added!');
            }
            cursus_general();

        }
    })
}

function delete_cursus_before(cid) {
    $.ajax({
        type : 'GET',
        url : "/api/cursus/" + cid,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                document.getElementById("d_cursus_tmp_cid").value = cid;
                document.getElementById("d_cursus_tmp_sid").value = data.data.student.sid;
                document.getElementById("d_cursus_tmp_nom").value = data.data.student.nom;
                document.getElementById("d_cursus_tmp_prenom").value = data.data.student.prenom;
                document.getElementById("d_cursus_tmp_adm").value = data.data.student.admission;
                document.getElementById("d_cursus_tmp_filiere").value = data.data.student.filiere;

            }
        }
    });

    $("#cursus_delete_save_btn").unbind();

    $("#cursus_delete_save_btn").click(function () {
        delete_cursus(cid);
        $("#deleteCursusModal").modal('hide');
    });
    $("#deleteCursusModal").modal('toggle');

}

function delete_cursus(cid) {
    r_key = document.getElementById("key").value;
    p_data = '{"key":"' + r_key + '"}';

    $.ajax({
        type : 'DELETE',
        url : "/api/cursus/" + cid,
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Deleted!');
            }
            cursus_general();
        }
    });
}

function copy_cursus_before(cid) {
    $.ajax({
        type : 'GET',
        url : "/api/cursus/" + cid,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                document.getElementById("c_cursus_tmp_cid").value = cid;
                document.getElementById("c_cursus_tmp_sid").value = data.data.student.sid;
                document.getElementById("c_cursus_tmp_nom").value = data.data.student.nom;
                document.getElementById("c_cursus_tmp_prenom").value = data.data.student.prenom;
                document.getElementById("c_cursus_tmp_adm").value = data.data.student.admission;
                document.getElementById("c_cursus_tmp_filiere").value = data.data.student.filiere;

            }
        }
    });
    $("#cursus_copy_save_btn").unbind();

    $("#cursus_copy_save_btn").click(function () {
        copy_cursus(cid);
        $("#copyCursusModal").modal('hide');
    });
    $("#copyCursusModal").modal('toggle');

}

function copy_cursus(cid) {
    r_key = document.getElementById("key").value;
    p_data = '{"key":"' + r_key + '", "method":"copy","cid":' + cid + '}';

    $.ajax({
        type : 'POST',
        url : "/api/cursus",
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Copyed!');
            }
            cursus_general();
        }
    })

}
