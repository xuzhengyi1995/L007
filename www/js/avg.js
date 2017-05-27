// JavaScript Document
$(function () {

    $.ajax({
        type : 'GET',
        url : "/api/cursus",
        contentType : "application/json",
        dataType : "json",
        success : function (data) {
            if (data.is_error) {
                alert(get_error_info(data.error_info));
            } else {
                var s_data = data.data;
                var s = 0;
                for (i = 0; i < s_data.length; i++) {
                    if (i % 2 === 0) {
                        ++s;
                        document.getElementById("avg_div").innerHTML += '<div class="row" ' + 'id=avg_row' + s + '></div>';
                    }
                    document.getElementById("avg_row" + s).innerHTML += '<div class="col-lg-6"><div class="panel panel-default"><div class="panel-heading" ' + 'onClick="cursus_on_n_detail(' + s_data[i].cid + ',\'index_avg()\')" >' + 'Cid:' + s_data[i].cid + '  Sid:' + s_data[i].student.sid + '  ' + s_data[i].student.nom + ' ' + s_data[i].student.prenom + '  Admission:' + s_data[i].student.admission + '  Filiere:' + s_data[i].student.filiere + '</div><div class="panel-body"><div id="avg_' + s_data[i].cid + '"></div></div></div>';
                    $.get("/api/cursus/" + s_data[i].cid + '/statistic/avg', function (data) {
                        if (data.avg.length === 0) {
                            document.getElementById('avg_' + data.cid).innerHTML += '<h3>Cursus is empty</h3>';
                        } else {
                            Morris.Bar({
                                element : 'avg_' + data.cid,
                                data : data.avg,
                                xkey : 'x',
                                ykeys : ['y'],
                                labels : ['GPA'],
                                hideHover : 'auto',
                                resize : true
                            });
                        }
                    });
                }
            }
        }
    });
});
