function build_table(cid, eid, p_data, search_data) {
    document.getElementById("del_tables_check").innerHTML = '<table width="100%" class="table table-striped table-bordered table-hover" id="cursus_check_delete_elems"></table>';
    check_list = $('#cursus_check_delete_elems').DataTable({
            "searching" : false,
            data : p_data,
            columns :
            [{
                    orderable : false,
                    title : "Seq"
                }, {
                    orderable : false,
                    title : "Label"
                }, {
                    orderable : false,
                    title : "Sigle"
                }, {
                    orderable : false,
                    title : "Cat"
                }, {
                    orderable : false,
                    title : "Affec"
                }, {
                    orderable : false,
                    title : "Utt"
                }, {
                    orderable : false,
                    title : "Profil"
                }, {
                    orderable : false,
                    title : "Credit"
                }, {
                    orderable : false,
                    title : "Resultat"
                }
            ]
        });
    $("#cursus_check_close_btn").unbind();
    $("#cursus_check_close_btn_x").unbind();
    $("#cursus_check_save_btn").unbind();

    $("#cursus_check_close_btn").click(function () {
        check_list.destroy(true);
        $("#delete_btn").button('reset');
        $("#delete_btn").dequeue();
    });

    $("#cursus_check_close_btn_x").click(function () {
        check_list.destroy(true);
        $("#delete_btn").button('reset');
        $("#delete_btn").dequeue();
    });

    $("#cursus_check_save_btn").click(function () {
        cursus_ele_on_delete(cid, search_data);
        $("#deleteModal").modal('hide');
        $("#delete_btn").button('reset');
        $("#delete_btn").dequeue();
    });

    $("#deleteModal").modal();
}

function cursus_ele_before_delete(cid) {
    var i = 0;
    var s = 0;
    var del_ele = Array();
    choose = document.getElementById("choose_all").checked;
    p = document.getElementsByClassName("check_box");
    num = p.length;
    var i = 0;
    while (i < num) {
        if (p[i].checked) {
            del_ele[s++] = p[i].getAttribute("eid");
        }
        ++i;
    }
    if (s === 0) {
        alert("Please select the elements you want to delete.");
        throw new Error("ERROR_NO_SELECTED");
    }
    var p_data = Array();
    $("#delete_btn").button("loading").queue(function () {
        search_data = del_ele[0];
        for (i = 1; i < s; i++) {
            var eid = del_ele[i];
            search_data += "," + eid;
        }
        $.ajax({
            type : 'GET',
            url : "/api/cursus/" + cid + '/' + search_data,
            contentType : "application/json",
            dataType : "json",
            success : function (data) {
                if (!data.is_error) {
                    for (i = 0; i < data.elem.length; i++) {
                        p_data.push(Array(data.elem[i].s_seq, data.elem[i].s_label, data.elem[i].sigle, data.elem[i].categorie, data.elem[i].affectation, data.elem[i].utt, data.elem[i].profil, data.elem[i].credit, data.elem[i].resultat));
                    }
                    build_table(cid, eid, p_data, search_data);
                } else {
                    alert(data.error_info);
                    throw new Error("Get data Error");
                }
            }
        });
    });
}

function cursus_ele_on_delete(cid, search_data) {
    r_key = document.getElementById("key").value;
    delete_data = {
        "key" : r_key
    };
    $.ajax({
        type : 'DELETE',
        url : "/api/cursus/" + cid + "/" + search_data,
        data : JSON.stringify(delete_data),
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Deleted!');
            }
            cursus_on_detail(cid, 'cursus_on_back()');
        }
    });
}

function make_input_text(id, default_value, readonly) {
    return "<input class=\"form-control\" id=\"" + id + "\" name=\"" + id + "\" type = \"text\"  size=\"6\" value=\"" + default_value + '" ' + ((readonly) ? "readonly " : "") + ">";
}

function cursus_select_cours(id, seg, callback) {
    $.ajax({
        type : 'GET',
        url : "http://xzy.freeboxos.fr:8080/cours",
        headers : {
            Accept : "application/json"
        },
        success : function (data) {
            //console.log(data);
            var s = ' <select id="' + id + '" class="selectpicker" data-live-search="true" data-size="5">';
            p_data = data.data;
            s += '<option value="' + seg + '">' + seg + '</option>';
            for (i = 0; i < p_data.length; i++) {
                s += '<option value="' + p_data[i].code + '">' + p_data[i].code + '</option>';
            }
            s += "</select>";
            callback(p_data, s);
        },
        error : function (r) {
            alert(r.responseJSON.error_info);
        }
    });
}

function cursus_ele_before_edit(cid, eid) {
    id = "edit_btn_" + eid;
    $("#" + id).button("loading").delay(100).queue(function () {
        $.ajax({
            type : 'GET',
            url : "/api/cursus/" + cid + "/" + eid,
            contentType : "application/json",
            dataType : "json",
            success : function (data) {
                if (!data.is_error) {
                    cursus_select_cours("tmp_sigle", data.elem[0].sigle, function (data_cours, s) {
                        var p_data = Array(Array(make_input_text("tmp_s_seq", data.elem[0].s_seq, false), make_input_text("tmp_s_label", data.elem[0].s_label, false), s, make_input_text("tmp_cat", data.elem[0].categorie, true), make_input_text("tmp_affec", data.elem[0].affectation, true), make_input_text("tmp_utt", data.elem[0].utt, false), make_input_text("tmp_profile", data.elem[0].profil, false), make_input_text("tmp_credit", data.elem[0].credit, true), make_input_text("tmp_resultat", data.elem[0].resultat, false)));
                        document.getElementById("edit_tables_check").innerHTML = '<input id="tmp_eid" name="tmp_eid" hidden="ture" value="' + eid + '">';
                        document.getElementById("edit_tables_check").innerHTML += '<table width="100%" class="table table-striped table-bordered table-hover" id="cursus_check_edit_elems"></table>';
                        check_list = $('#cursus_check_edit_elems').DataTable({
                                "paging" : false,
                                "searching" : false,
                                data : p_data,
                                columns :
                                [{
                                        orderable : false,
                                        title : "Seq"
                                    }, {
                                        orderable : false,
                                        title : "Label"
                                    }, {
                                        orderable : false,
                                        title : "Sigle"
                                    }, {
                                        orderable : false,
                                        title : "Cat"
                                    }, {
                                        orderable : false,
                                        title : "Affec"
                                    }, {
                                        orderable : false,
                                        title : "Utt"
                                    }, {
                                        orderable : false,
                                        title : "Profil"
                                    }, {
                                        orderable : false,
                                        title : "Credit"
                                    }, {
                                        orderable : false,
                                        title : "Resultat"
                                    }
                                ]
                            });
                        $('.selectpicker').selectpicker('render');
                        $('#tmp_sigle').change(function () {
                            $("select option:selected").each(function () {
                                str = document.getElementById("tmp_sigle").value;
                                for (i = 0; i < data_cours.length; i++) {
                                    if (data_cours[i].code === str) {
                                        document.getElementById("tmp_cat").value = data_cours[i].type;
                                        document.getElementById("tmp_affec").value = data_cours[i].affectation;
                                        document.getElementById("tmp_credit").value = data_cours[i].credit;
                                    }
                                }
                            });
                        });
                    });
                } else {
                    alert(data.error_info);
                }
            }
        })
        $("#cursus_edit_close_btn").unbind();
        $("#cursus_edit_close_btn_x").unbind();
        $("#cursus_edit_save_btn").unbind();

        $("#cursus_edit_close_btn").click(function () {
            check_list.destroy(true);
            $("#" + id).button('reset');
            $("#" + id).dequeue();
        });

        $("#cursus_edit_close_btn_x").click(function () {
            check_list.destroy(true);
            $("#" + id).button('reset');
            $("#" + id).dequeue();
        });

        $("#cursus_edit_save_btn").click(function () {
            data = {};
            data.eid = document.getElementById("tmp_eid").value;
            data.s_seq = (document.getElementById("tmp_s_seq").value).toUpperCase();
            data.s_label = (document.getElementById("tmp_s_label").value).toUpperCase();
            data.sigle = (document.getElementById("tmp_sigle").value).toUpperCase();
            data.categorie = (document.getElementById("tmp_cat").value).toUpperCase();
            data.affectation = (document.getElementById("tmp_affec").value).toUpperCase();
            data.utt = (document.getElementById("tmp_utt").value).toUpperCase();
            data.profil = (document.getElementById("tmp_profile").value).toUpperCase();
            data.credit = (document.getElementById("tmp_credit").value).toUpperCase();
            data.resultat = (document.getElementById("tmp_resultat").value).toUpperCase();

            data_to_save = JSON.stringify(data);
            cursus_ele_on_edit(cid, data.eid, data_to_save);
            $("#editModal").modal('hide');
            $("#" + id).button('reset');
            $("#" + id).dequeue();
        });

        $("#editModal").modal();
    });
}

function cursus_ele_on_edit(cid, eid, data) {
    r_key = document.getElementById("key").value;
    p_data = '{"key":"' + r_key + '","data":' + data + '}';
    //alert(p_data);
    $.ajax({
        type : 'PUT',
        url : "/api/cursus/" + cid + "/" + eid,
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Edited!');
            }
            cursus_on_detail(cid, 'cursus_on_back()');

        }
    })
}

function cursus_ele_before_add(cid, data) {
    cursus_select_cours("tmp_add_sigle", "Code", function (data_cours, s) {
        if (data == '') {
            var p_data = Array(Array(make_input_text("tmp_add_s_seq", data, false), make_input_text("tmp_add_s_label", data, false), s, make_input_text("tmp_add_cat", data, true), make_input_text("tmp_add_affec", data, true), make_input_text("tmp_add_utt", data, false), make_input_text("tmp_add_profile", data, false), make_input_text("tmp_add_credit", data, true), make_input_text("tmp_add_resultat", data, false)));
        } else {
            var p_data = data;
        }
        document.getElementById("add_tables_check").innerHTML += '<table width="100%" class="table table-striped table-bordered table-hover" id="cursus_check_add_elems"></table>';
        check_list = $('#cursus_check_add_elems').DataTable({
                "paging" : false,
                "searching" : false,
                data : p_data,
                columns :
                [{
                        orderable : false,
                        title : "Seq"
                    }, {
                        orderable : false,
                        title : "Label"
                    }, {
                        orderable : false,
                        title : "Sigle"
                    }, {
                        orderable : false,
                        title : "Cat"
                    }, {
                        orderable : false,
                        title : "Affec"
                    }, {
                        orderable : false,
                        title : "Utt"
                    }, {
                        orderable : false,
                        title : "Profil"
                    }, {
                        orderable : false,
                        title : "Credit"
                    }, {
                        orderable : false,
                        title : "Resultat"
                    }
                ]
            });
        $('.selectpicker').selectpicker('render');
        $('#tmp_add_sigle').change(function () {
            $("select option:selected").each(function () {
                str = document.getElementById("tmp_add_sigle").value;
                for (i = 0; i < data_cours.length; i++) {
                    if (data_cours[i].code === str) {
                        document.getElementById("tmp_add_cat").value = data_cours[i].type;
                        document.getElementById("tmp_add_affec").value = data_cours[i].affectation;
                        document.getElementById("tmp_add_credit").value = data_cours[i].credit;
                    }
                }
            });
        });
    });
    $("#cursus_add_close_btn").unbind();
    $("#cursus_add_close_btn_x").unbind();
    $("#cursus_add_save_btn").unbind();

    $("#cursus_add_close_btn").click(function () {
        check_list.destroy(true);
    });

    $("#cursus_add_close_btn_x").click(function () {
        check_list.destroy(true);
    });

    $("#cursus_add_save_btn").click(function () {
        data = {};
        data.s_seq = (document.getElementById("tmp_add_s_seq").value).toUpperCase();
        data.s_label = (document.getElementById("tmp_add_s_label").value).toUpperCase();
        data.sigle = (document.getElementById("tmp_add_sigle").value).toUpperCase();
        data.categorie = (document.getElementById("tmp_add_cat").value).toUpperCase();
        data.affectation = (document.getElementById("tmp_add_affec").value).toUpperCase();
        data.utt = (document.getElementById("tmp_add_utt").value).toUpperCase();
        data.profil = (document.getElementById("tmp_add_profile").value).toUpperCase();
        data.credit = (document.getElementById("tmp_add_credit").value).toUpperCase();
        data.resultat = (document.getElementById("tmp_add_resultat").value).toUpperCase();

        if (data.s_seq == "" || data.s_label == "" || data.sigle == "" || data.categorie == "" || data.affectation == "" || data.utt == "" ||
            data.profil == "" || data.credit == "" || data.resultat == "") {
            alert("Please fill in all the blanks");
            var p_data = Array(Array(make_input_text("tmp_add_s_seq", data.s_seq), make_input_text("tmp_add_s_label", data.s_label), make_input_text("tmp_add_sigle", data.sigle), make_input_text("tmp_add_cat", data.categorie),
                        make_input_text("tmp_add_affec", data.affectation), make_input_text("tmp_add_utt", data.utt), make_input_text("tmp_add_profile", data.profil), make_input_text("tmp_add_credit", data.credit), make_input_text("tmp_add_resultat", data.resultat)));
            check_list.destroy(true);
            cursus_ele_before_add(cid, p_data);
            throw new Error("not a error");
        } else {
            data_to_save = JSON.stringify(data);
            cursus_ele_on_add(cid, data_to_save);
            //alert(data_to_save);
            check_list.destroy(true);
            $("#addModal").modal('hide');
            throw new Error("not a error");
        }

    });
    if (data == '') {
        $("#addModal").modal();
    }
}

function cursus_ele_on_add(cid, data) {
    r_key = document.getElementById("key").value;
    p_data = '{"key":"' + r_key + '","data":' + data + '}';
    //alert(p_data);
    $.ajax({
        type : 'POST',
        url : "/api/cursus/" + cid,
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                alert('Added!');
            }
            cursus_on_detail(cid, 'cursus_on_back()');

        }
    })
}
