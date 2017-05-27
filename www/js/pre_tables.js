// JavaScript Document
function display_table(url) {
    if (url === undefined) {
        url = "/api/cursus";
    }
    $.ajax({
        type : 'GET',
        url : url,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(get_error_info(data.error_info));
            } else {
                var s_data = data.data;
                var p_data = new Array();
                for (i = 0; i < s_data.length; i++) {
                    temp = new Array(s_data[i].cid, s_data[i].student.sid, s_data[i].student.nom, s_data[i].student.prenom, s_data[i].student.admission, s_data[i].student.filiere, s_data[i].type, '<button id="_detail_btn_' + s_data[i].cid + '" onClick="cursus_on_n_detail(' + s_data[i].cid + ',\'index_search_nom()\')" class="btn btn-success" type="button" ><span class="glyphicon glyphicon-th-list" aria-hidden="true"></button>', '<form method="get" id="' + s_data[i].cid + '" action="../api/cursus/' + s_data[i].cid + '/csv" target="_blank">' + '<button id="_export_btn_' + s_data[i].cid + '"  class="btn btn-success" type="submit"><span class="glyphicon glyphicon-open" aria-hidden="true"></span></button></form>', '<button id="delete_cursus_btn" onClick="copy_cursus_before(' + s_data[i].cid + ')" class="btn btn-success" type="button" ><span class="fa fa-copy" aria-hidden="true"></button>', '<button id="_delete_cursus_btn_' + s_data[i].cid + '" onClick="delete_cursus_before(' + s_data[i].cid + ')" class="btn btn-danger" type="button" ><span class="glyphicon glyphicon-minus" aria-hidden="true"></button>');
                    p_data[i] = temp;
                }

                var table = $('#my_cursus').DataTable({
                        data : p_data,
                        columns : [{
                                title : "Cid"
                            }, {
                                title : "Sid"
                            }, {
                                title : "Nom"
                            }, {
                                title : "Prenom"
                            }, {
                                title : "Admission"
                            }, {
                                title : "Filiere"
                            }, {
                                title : "Type"
                            }, {
                                orderable : false,
                                title : "Detail"
                            }, {
                                orderable : false,
                                title : "Export"
                            }, {
                                orderable : false,
                                title : "Copy"
                            }, {
                                orderable : false,
                                title : "Delete"
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
                            }, {
                                className : "btn_d",
                                "targets" : [10]
                            }
                        ]
                    });
            }
        }
    });
};
