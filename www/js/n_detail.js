// JavaScript Document
function cursus_on_n_detail(cid, from) {
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
                $.get('n_tables.html', '', function (result) {
                    $('#page-wrapper').html(result);

                    document.getElementById("cursus_head").innerHTML = document.getElementById("cursus_head").innerHTML + " " + g_cid + "/" + data.student.nom + ' ' + data.student.prenom;
                    document.getElementById("cursus_student").innerHTML = '<div class="dataTables_wrapper form-inline dt-bootstrap no-footer"><div class="row"><div class="col-sm-10" vertical-align="middle" ><h5>Cid:' + g_cid + '  Sid:' + data.student.sid + '  ' + data.student.nom + ' ' + data.student.prenom + '  Admission:' + data.student.admission + '  Filiere:' + data.student.filiere + '</h5></div><div id="rule_check_div" class="col-sm-2"></div></div></div><input type="text" hidden readonly="true" id="s_fil" value=' + data.student.filiere + '></input>';
                    document.getElementById("cursus_edit_btn").setAttribute("onClick", "cursus_on_detail(" + g_cid + ",'cursus_on_n_detail(" + g_cid + ",\\'" + from + "\\')')");
                    document.getElementById("cursus_back_btn").setAttribute("onClick", from);

                    $.get("/api/cursus/" + g_cid + '/statistic', function (st_data) {
                        if (st_data.avg.length === 0) {
                            document.getElementById('n_avg').innerHTML += '<h3>Cursus is empty</h3>';
                            document.getElementById('n_sum').innerHTML += '<h3>Cursus is empty</h3>';
                        } else {
                            Morris.Bar({
                                element : 'n_avg',
                                data : st_data.avg,
                                xkey : 'x',
                                ykeys : ['y'],
                                labels : ['GPA'],
                                hideHover : 'auto',
                                resize : true
                            });

                            Morris.Bar({
                                element : 'n_sum',
                                data : st_data.sum,
                                xkey : 'x',
                                ykeys : ['y'],
                                labels : ['Credits'],
                                hideHover : 'auto',
                                resize : true
                            });
                        }
                    });

                    //function of make rule select html
                    $(function () {
                        $.ajax({
                            type : 'GET',
                            url : "http://xzy.freeboxos.fr:8080/rules?detail=false",
                            contentType : "application/json",
                            dataType : "json",
                            success : function (data) {
                                if (data.is_error) {
                                    alert(data.error_info);
                                } else {
                                    data = data.data;
                                    tmp_select_groupe = '<span><label>Regle: </label><select id="rule_applyed" class="form-control">';
                                    for (i = 0; i < data.length; i++) {
                                        tmp_select_groupe += '<option value=' + data[i]._id + '>' + data[i].name + '</option>';
                                    }
                                    tmp_select_groupe += '</select>';
                                    tmp_select_groupe += '<button class="fa fa-check btn btn-success btn-sm" onClick="before_check_cursus(' + g_cid + ')"></button>';
                                    tmp_select_groupe += '</span>';
                                    document.getElementById("rule_check_div").innerHTML = tmp_select_groupe;
                                }
                            },
                            error : function (r) {
                                alert(r.responseJSON.error_info);
                            }

                        });
                    });

                    max_seq = parseInt(data.elems[0].s_seq);

                    for (i = 1; i < data.elems.length; i++) {
                        if (parseInt(data.elems[i].s_seq) > max_seq) {
                            max_seq = parseInt(data.elems[i].s_seq);
                        }
                    }
                    p_data = new Array(max_seq * 2);
                    s_cre = new Array(max_seq);
                    for (i = 0; i < max_seq * 2; i++) {
                        p_data[i] = Array(10);
                        p_data[i][0] = i;
                        if (i < max_seq) {
                            s_cre[i] = Array(10);
                            for (j = 0; j < 10; j++) {
                                s_cre[i][j] = 0;
                            }
                        }
                    }
                    //			data.elems[i].s_seq,data.elems[i].s_label,data.elems[i].categorie,data.elems[i].affectation,data.elems[i].utt,data.elems[i].profil
                    lab = Array("CS", "TM", "ST", "EC", "ME", "CT", "HP", "NPML");
                    for (i = 0; i < data.elems.length; i++) {
                        p_i = (parseInt(data.elems[i].s_seq) - 1) * 2;
                        temp = data.elems[i].sigle + " " + data.elems[i].resultat + " " + data.elems[i].credit + "<br/>";
                        if (p_data[p_i][1] == undefined) {
                            p_data[p_i][1] = data.elems[i].s_label;
                        }
                        for (j = 0; j < lab.length; j++) {
                            if (p_data[p_i][j + 2] == undefined) {
                                p_data[p_i][j + 2] = '';
                            }
                            if (data.elems[i].categorie == lab[j]) {
                                p_data[p_i][j + 2] += temp;
                                s_cre[p_i / 2][j + 2] += parseInt(data.elems[i].credit);
                            }
                        }
                    }

                    for (i = 0; i < max_seq * 2; i++) {
                        if (i % 2 == 1) {
                            p_data[i][1] = '<div class="total">Total</div>';
                            for (j = 0; j < lab.length; j++) {
                                p_data[i][j + 2] = '';
                                if (s_cre[(i - 1) / 2][j + 2] != 0) {
                                    p = s_cre[(i - 1) / 2][j + 2];
                                    p_data[i][j + 2] = '<div class="t_cre">' + p + "</div>";
                                }
                            }
                        }
                    }

                    var table = $('#cursus_elems').DataTable({
                            "paging" : false,
                            data : p_data,
                            columns : [{
                                    searchable : false,
                                    title : "Seq"
                                }, {
                                    orderable : false,
                                    title : "Lab"
                                }, {
                                    orderable : false,
                                    title : "CS"
                                }, {
                                    orderable : false,
                                    title : "TM"
                                }, {
                                    orderable : false,
                                    title : "ST"
                                }, {
                                    orderable : false,
                                    title : "EC"
                                }, {
                                    orderable : false,
                                    title : "ME"
                                }, {
                                    orderable : false,
                                    title : "CT"
                                }, {
                                    orderable : false,
                                    title : "HP"
                                }, {
                                    orderable : false,
                                    title : "NPML"
                                }
                            ],
                            "columnDefs" :
                            [{
                                    className : "seq",
                                    "targets" : [0]
                                }, {
                                    className : "lab",
                                    "targets" : [1]
                                }
                            ]
                        });
                });
            }
        }
    });
}
