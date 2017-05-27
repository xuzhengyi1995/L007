// JavaScript Document
function cursus_on_detail(cid, from) {
    $.ajax({
        type : 'GET',
        url : "/api/cursus/" + cid,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                document.getElementById("err_info").innerHTML = get_error_info(data.error_info);
                document.getElementById("error").removeAttribute("hidden");
            } else {
                g_cid = data.cid;
                data = data.data;
                $.get('cursus.html', '', function (result) {
                    $('#page-wrapper').html(result);
                    document.getElementById("delete_btn").setAttribute("onClick", "cursus_ele_before_delete(" + cid + ")");

                    document.getElementById("cursus_head").innerHTML = document.getElementById("cursus_head").innerHTML + " " + g_cid + "/" + data.student.nom + ' ' + data.student.prenom;
                    document.getElementById("cursus_student").innerHTML = 'Cid:' + g_cid + '  Sid:' + data.student.sid + '  ' + data.student.nom + ' ' + data.student.prenom + '  Admission:' + data.student.admission + '  Filiere:' + data.student.filiere;
                    document.getElementById("cursus_back_btn").setAttribute("onClick", from);
                    document.getElementById("add_cursus_elem").setAttribute("onClick", "cursus_ele_before_add(" + g_cid + ", '')");

                    p_data = Array();
                    for (i = 0; i < data.elems.length; i++) {
                        temp = Array(data.elems[i].s_seq, data.elems[i].s_label, data.elems[i].sigle, data.elems[i].categorie, data.elems[i].affectation, data.elems[i].utt, data.elems[i].profil, data.elems[i].credit, data.elems[i].resultat, '<button id="edit_btn_' + data.elems[i].eid + '" onClick="cursus_ele_before_edit(' + g_cid + ', ' + data.elems[i].eid + ')" class="btn btn-success" data-loading-text="Editing..." type="button" ><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>', '<input type="checkbox" class="check_box" name="cursus_one_check_box" id="_detail_cbx_' + i + '" eid="' + data.elems[i].eid + '">');
                        p_data[i] = temp;
                    }

                    var table = $('#cursus_elems').DataTable({
                            data : p_data,
                            columns :
                            [{
                                    title : "Seq"
                                }, {
                                    title : "Label"
                                }, {
                                    title : "Sigle"
                                }, {
                                    title : "Cat"
                                }, {
                                    title : "Affec"
                                }, {
                                    title : "Utt"
                                }, {
                                    title : "Profil"
                                }, {
                                    title : "Credit"
                                }, {
                                    title : "Resultat"
                                }, {
                                    title : "Edit"
                                }, {
                                    orderable : false,
                                    title : '<input align="center" id="choose_all" type="checkbox" onClick="cursus_check_all()">'
                                }
                            ],
                            "columnDefs" :
                            [{
                                    className : "btn_d",
                                    "targets" : [9]
                                }, {
                                    className : "btn_d",
                                    "targets" : [10]
                                }
                            ]
                        });
                });
            }
        }
    });
}

function cursus_on_back() {
    $.get('welcome.php', '', function (result) {
        $('#page-wrapper').html(result);
        url = '/api/cursus';
        display_table(url);
    });
}

function cursus_check_all() {
    s = document.getElementById("choose_all").checked;
    e = document.getElementsByClassName("check_box");
    num = e.length;
    var i = 0;
    while (i < num) {
        e[i].checked = s;
        ++i;
    }
}
