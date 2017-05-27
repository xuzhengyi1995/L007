function before_check_cursus(cid) {
    rule_id = document.getElementById("rule_applyed").value;
    $.ajax({
        type : 'GET',
        url : "/api/cursus/" + cid,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                g_cid = data.cid;
                data = data.data;
                data_to_check = JSON.stringify(data.elems);
                check_cursus(rule_id, data_to_check, cid);
            }
        }
    });

}

function check_cursus(rule_id, data_to_check, cid) {
    var fil = document.getElementById("s_fil").value;
    p_data = '{"r_id":"' + rule_id + '", "filiere":"' + fil + '", "elems":' + data_to_check + '}';
    $.ajax({
        type : 'POST',
        url : "http://xzy.freeboxos.fr:8080/v_rules?re=both",
        data : p_data,
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(data.error_info);
            } else {
                //alert("rule applyed, result is below");
                commit = data.commit; //rule apply situation
                re_list = data.re_data.recommend_list; //recommend cours list
                after_situation = data.re_data.after_situation; //apply situation after recommended
                cours_info = data.re_data.cours_info;

                $("#rules_check_result").html('<div class="col-lg-6 " ><div class="panel panel-default"><div class="panel-heading"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span>   Passed rules </div><div class="panel-body alert alert-success" id="rules_pass_result"></div></div></div><div class="col-lg-6" ><div class="panel panel-default"><div class="panel-heading"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span>   Unpassed rules </div><div class="panel-body alert alert-danger" id="rules_not_pass_result"></div></div></div>');
                $("#rules_check_result_r").html('<div class="col-lg-12" ><div class="panel panel-default"><div class="panel-heading"><span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>   Recommend list </div><div class="panel-body alert alert-info" id="recommend_list"></div></div>');
                rule_check("rules_pass_result", "rules_not_pass_result", commit);
                recommend_list_show("recommend_list", re_list, cours_info, cid, after_situation);
                //alert(JSON.stringify(data));
            }
        },
        error : function (r) {
            alert(r.responseJSON.error_info);
        }
    });
}

function rule_check(id_div_pass, id_div_not_pass, data) {
    var pass_print = '<table class="table table-hover table-striped" width="100%" align="center"><tr align="center"><th>No</th><th>Type</th><th>Check</th><th>Affectation</th><th>Credit</th><th>Passed</th></tr>';
    var not_pass_print = '<table class="table table-hover table-striped" width="100%" align="center"><tr align="center"><th>No</th><th>Type</th><th>Check</th><th>Affectation</th><th>Credit</th><th>Passed</th></tr>';
    var flag_p = 0;
    var flag_n = 0;
    for (var i = 0; i < data.length; i++) {
        var k = i + 1;
        if (data[i].ok == "yes") {
            pass_print += '<tr>';
            pass_print += '<td>' + k + '</td>';
            pass_print += '<td>' + data[i].rule.type + '</td>'
            pass_print += '<td>' + data[i].rule.check + '</td>';
            pass_print += '<td>' + data[i].rule.affectation + '</td>';
            pass_print += '<td>' + data[i].already + '/' + data[i].rule.credit + '</td>';
            pass_print += '<td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>';
            pass_print += '</tr>';
            flag_p = 1;
        } else {
            not_pass_print += '<tr>';
            not_pass_print += '<td>' + k + '</td>';
            not_pass_print += '<td>' + data[i].rule.type + '</td>'
            not_pass_print += '<td>' + data[i].rule.check + '</td>';
            not_pass_print += '<td>' + data[i].rule.affectation + '</td>';
            not_pass_print += '<td>' + data[i].already + '/' + data[i].rule.credit + '</td>';
            not_pass_print += '<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>';
            not_pass_print += '</tr>';
            flag_n = 1;
        }
    }
    pass_print += '</table>';
    not_pass_print += '</table>';
    document.getElementById(id_div_pass).innerHTML = pass_print;
    document.getElementById(id_div_not_pass).innerHTML = not_pass_print;
    if (flag_p == 0) {
        document.getElementById(id_div_pass).innerHTML = '<h3>Sorry, none of the rule is passed, cheer up and study hard.</h3>';
    }
    if (flag_n == 0) {
        document.getElementById(id_div_not_pass).innerHTML = '<h3>Congratulation, you have pass all of the rules, you are free to graduate.</h3>';
    }
}

function recommend_list_show(id_div, r_l, c_i, cid, a_sit) {
    if (!$.isEmptyObject(r_l)) {
        list_html = '<table class="table table-hover table-striped" width="100%" align="center"><tr>';
        var s = 1;
        for (var key_name in r_l) {
            list_html += '<td align="center" onClick="cours_detail(\'' + key_name + '\',\'cursus_on_n_detail(' + cid + ',\\\'cursus_general()\\\')\')">' + key_name + '</td>';
            if (s % 12 === 0) {
                list_html += '</tr><tr>';

            }
            ++s;
        }
        list_html += '</tr>';
        list_html += '</table></br>';
        list_html += '<button id="btn_r_l_detail" class="btn btn-info btn-block">Detail</button></br>';
        list_html += '<div id="div_r_l_detail"></div>';
        document.getElementById(id_div).innerHTML = list_html;
    } else {
        document.getElementById(id_div).innerHTML = "<h3>Sorry, we dont have specific cours appropriate for you.</h3>";
    }

    $("#btn_r_l_detail").unbind;
    $("#btn_r_l_detail").bind("click", function () {
        document.getElementById("btn_r_l_detail").innerText = "Close detail";
        $("#btn_r_l_detail").unbind;
        $("#btn_r_l_detail").bind("click", function () {
            document.getElementById("btn_r_l_detail").innerText = "Detail";
            document.getElementById("div_r_l_detail").innerHTML = '';
            recommend_list_show(id_div, r_l, c_i, cid, a_sit);
        });
        var detail_list_html = '<table class="table table-hover table-striped" width="100%" align="center"><tr align="center"><th>No</th><th>Type</th><th>Check</th><th>Affectation</th><th>Credit remains</th><th>Cours/Credit</th><th>Passed</th></tr>';
        for (var i = 0; i < c_i.length; i++) {
            var temp_as = a_sit[i];
            var cours_t = '';
            if (!$.isEmptyObject(c_i[i])) {
                var k = i + 1;
                for (var j = 0; j < c_i[i].length; j++) {
                    cours_t += c_i[i][j].code + '&nbsp;/&nbsp;' + c_i[i][j].credit + '&nbsp;&nbsp;&nbsp;&nbsp;';
                    if (j % 6 === 5) {
                        cours_t += '</br>';
                    }
                }
            }
            detail_list_html += '<tr>';
            detail_list_html += '<td>' + (a_sit[i].r_seq + 1) + '</td>';
            detail_list_html += '<td>' + a_sit[i].type + '</td>'
            detail_list_html += '<td>' + a_sit[i].check.join(' , ') + '</td>';
            detail_list_html += '<td>' + a_sit[i].aff + '</td>';
            detail_list_html += '<td>' + (a_sit[i].remain >= 0 ? a_sit[i].remain : '0') + '</td>';
            detail_list_html += '<td>' + cours_t + '</td>';
            detail_list_html += '<td><span class="' + (a_sit[i].is_ok ? 'glyphicon glyphicon-ok' : 'glyphicon glyphicon-remove') + '" aria-hidden="true"></span></td>';
            detail_list_html += '</tr>';

        }
        document.getElementById("div_r_l_detail").innerHTML = detail_list_html;
    });

}
