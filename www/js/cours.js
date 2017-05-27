// JavaScript Document
function cours_get_stars(id, point, is_js) {
    var star = (is_js ? '<div onClick="cours_on_note(\'' + id + '\')" id="' + id + '">' : '<div id="' + id + '">');
    p = Math.round(point);
    for (j = 0; j < p; j++) {
        star += '<span class="glyphicon glyphicon-star star" aria-hidden="true"></span>';
    }
    for (j = 0; j < 5 - p; j++) {
        star += '<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>';
    }
    return star;
}

function cours_on_note(id) {
    document.getElementById("cours_e_error_main").setAttribute("hidden", true);
    document.getElementById('cours_note_name').innerHTML = '<h4 class="modal-title" >Like ' + id + ' or not?</h4>';
    document.getElementById('cours_note_change').setAttribute('onChange', 'cours_get_note(\'' + id + '\')');
    $.ajax({
        type : 'GET',
        url : "http://xzy.freeboxos.fr:8080/rate_cours/" + id,
        xhrFields : {
            withCredentials : true
        },
        headers : {
            Accept : "application/json"
        },
        success : function (r) {
            if (r.is_error) {
                alert(r.err_info);
            } else {
                if (r.is_rated) {
                    cours_m_over(r.old_note);
                }
            }
        },
        error : function (r) {
            alert(r.responseJSON.error_info);
        }
    });
    $("#cours_note_modal").modal('toggle');
}

function cours_get_note(cours, update) {
    document.getElementById("cours_e_error_main").setAttribute("hidden", true);
    if (update === undefined || !update) {
        var m = 'POST';
    } else {
        var m = 'PUT';
    }
    for (i = 1; i < 11; i++) {
        if (document.getElementById('RadioGroup1_' + i).checked) {
            note = document.getElementById('RadioGroup1_' + i).value;
            var o_data = {
                "code" : cours,
                "note" : note,
                "update" : update
            };
            $.ajax({
                type : m,
                url : "http://xzy.freeboxos.fr:8080/rate_cours/" + cours,
                data : JSON.stringify(o_data),
                xhrFields : {
                    withCredentials : true
                },
                headers : {
                    Accept : "application/json"
                },
                contentType : "application/json",
                success : function (data) {
                    if (data.is_error) {
                        alert(data.err_info);
                    } else {
                        if (data.is_rated && (!data.update)) {
                            var time = new Date();
                            time.setTime(data.time);

                            var btn = '<input onClick="cours_get_note(\'' + cours + '\',true' + ')" class="btn btn-lg btn-success btn-block" type="button" value="Update">'
                                document.getElementById("cours_e_error").innerHTML = "<p>" + time.toLocaleString() + " : You have give a note " + data.old_note + "</p><p>" + btn + "</p>";
                            document.getElementById("cours_e_error_main").removeAttribute("hidden");
                        } else {
                            if (data.insert) {
                                alert("Your note has been recorded!");
                                $("#cours_note_modal").modal('hide');
                                //$("#cours_note_modal").unbind();
                                $("#cours_note_modal").on('hidden.bs.modal', function (r) {
                                    index_get_ue();
                                });
                            }
                            if (data.update) {
                                alert("Your note has been updated!");
                                $("#cours_note_modal").modal('hide');
                                //$("#cours_note_modal").unbind();
                                $("#cours_note_modal").on('hidden.bs.modal', function (r) {
                                    index_get_ue('');
                                });
                            }
                        }
                    }
                },
                error : function (r) {
                    alert(r.responseJSON.error_info);
                }
            });
        }
    }
}

function cours_m_over(id) {
    for (i = 1; i < 11; i++) {
        document.getElementById('n_' + i).removeAttribute('class');
        (i <= id ? document.getElementById('n_' + i).setAttribute('class', 'glyphicon glyphicon-star star_n') : document.getElementById('n_' + i).setAttribute('class', 'glyphicon glyphicon-star-empty star_no'));
    }
};

function cours_list_cours(filiter) {
    document.getElementById("h_cours").innerHTML += " " + filiter;
    document.getElementById("p_cours").innerHTML += " " + filiter;
    $.ajax({
        type : 'GET',
        url : "http://xzy.freeboxos.fr:8080/cours" + filiter,
        xhrFields : {
            withCredentials : true
        },
        headers : {
            Accept : "application/json"
        },
        xhrFields : {
            withCredentials : true
        },
        success : function (data) {
            var c_data = Array();
            data = data.data;
            for (i = 0; i < data.length; i++) {
                if (data[i].filiere === null) {
                    var filiere = {
                        MPL : ' ',
                        MSI : ' ',
                        MRI : ' '
                    };
                } else {
                    var filiere = {
                        MPL : ' ',
                        MSI : ' ',
                        MRI : ' '
                    };
                    for (j = 0; j < data[i].filiere.length; j++) {
                        filiere[data[i].filiere[j]] = '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>';
                    }
                }
                var detail = '<button id="cours_detail_btn_' + data[i].code + '" onClick="cours_detail(\'' + data[i].code + '\',\'index_get_ue(\\\'\\\')\')" class="btn btn-success" type="button"><span class="glyphicon glyphicon-list-alt" aria-hidden="true"></span></button>';
                c_data[i] = Array(data[i].code, data[i].type, data[i].affectation, data[i].credit, filiere.MPL, filiere.MSI, filiere.MRI, cours_get_stars('c_important', (data[i].importance) / 20, false), cours_get_stars(data[i].code, (data[i].mark) / 2, true), detail);
            }
            var table = $('#cours').DataTable({
                    data : c_data,
                    columns : [{
                            title : "Code"
                        }, {
                            title : "Type"
                        }, {
                            title : "Affectation"
                        }, {
                            title : "Credit"
                        }, {
                            title : "MPL"
                        }, {
                            title : "MSI"
                        }, {
                            title : "MRI"
                        }, {
                            title : "Importance"
                        }, {
                            title : "Like"
                        }, {
                            title : "Detail"
                        }
                    ],
                    "columnDefs" : [{
                            className : "btn_d",
                            "targets" : [7]
                        }, {
                            className : "btn_d",
                            "targets" : [8]
                        }, {
                            className : "btn_d",
                            "targets" : [9]
                        }
                    ]
                });
        },
        error : function (r) {
            alert(r.responseJSON.error_info);
        }
    });
}

function cours_detail(code, from) {
    $.get('cours_detail.html', '', function (result) {
        $('#page-wrapper').html(result);
        document.getElementById("h_cours").innerHTML += " " + code;
        document.getElementById("p_cours").innerHTML += " " + code;
        document.getElementById("cours_back_back_btn").setAttribute("onClick", from);

        $.ajax({
            type : 'GET',
            url : "http://xzy.freeboxos.fr:8080/cours/" + code + "?detail=true",
            xhrFields : {
                withCredentials : true
            },
            headers : {
                Accept : "application/json"
            },
            success : function (data) {
                var det = '';
                det += "<h1>" + data.data[0].wording + "</h1>";
                det += "<h3>Description</h3>";

                det += "<ul>";
                det += "<li>" + data.data[0].description + "</li>";
                det += "</ul>";

                det += "<h3>Detail</h3>";
                det += "<ol>";
                for (i = 0; i < data.data[0].programme.length; i++) {
                    det += "<li>" + data.data[0].programme[i] + "</li>";
                }
                det += "</ol>";

                document.getElementById("cours_detail").innerHTML = det;

                $.ajax({
                    type : 'GET',
                    url : "/api/get_lang/?lang=" + navigator.language,
                    headers : {
                        Accept : "application/json"
                    },
                    success : function (data_p) {
                        data_p = data_p.data;
                        var s = '<span align="right"> Select language : <select id="cours_c_lang" class="selectpicker" data-live-search="true" data-size="5" data-width="200px">';
                        for (i = 0; i < data_p.length; i++) {
                            s += '<option value="' + data_p[i].language + '">' + data_p[i].name + '</option>';
                        }
                        s += "</select></span>";
                        document.getElementById("p_cours").innerHTML += s;
                        $('.selectpicker').selectpicker('render');
                        $('#cours_c_lang').change(function () {
                            str = document.getElementById("cours_c_lang").value;
                            document.getElementById("pat_trans").removeAttribute("hidden");
                            document.getElementById("cours_tran").innerHTML = '<h3>Translating....</h3>';

                            var t = {
                                data : det,
                                to : str
                            };
                            $.ajax({
                                type : 'POST',
                                data : JSON.stringify(t),
                                url : "/api/get_trans/",
                                headers : {
                                    Accept : "application/json"
                                },
                                contentType : "application/json",
                                success : function (data_get) {
                                    document.getElementById("cours_tran").innerHTML = data_get.data.translatedText;
                                    if (str = 'en') {
                                        var ent = {
                                            data : data_get.data.translatedText
                                        };
                                        $.ajax({
                                            type : 'POST',
                                            data : JSON.stringify(ent),
                                            url : "/api/get_entity/",
                                            headers : {
                                                Accept : "application/json"
                                            },
                                            contentType : "application/json",
                                            success : function (data_ent) {
                                                document.getElementById("cours_tran").innerHTML = data_ent.data;
                                            }
                                        });
                                    }
                                }
                            });
                        });
                    }
                });

                var ent = {
                    data : det
                };
                $.ajax({
                    type : 'POST',
                    data : JSON.stringify(ent),
                    url : "/api/get_entity/",
                    headers : {
                        Accept : "application/json"
                    },
                    contentType : "application/json",
                    success : function (data_ent) {
                        document.getElementById("cours_detail").innerHTML = data_ent.data;
                    }
                });
            },
            error : function (r) {
                alert(r.responseJSON.error_info);
            }
        });
    });
}
