// JavaScript Document
function c_add_prog() {
    var num = document.getElementsByClassName("pro_p").length;

    var add = '<div class="form-inline" id="d_prog' + num + '"><div class="form-group"><label>Programme ' + num + ' : </label></div><div class="form-group"><input type="text" class="form-control pro_p" id="c_prog' + num + '" value="" size="60%"></div>    <div class="form-group"><button type="button" class="btn btn-default btn-sm" onClick="del_prog(' + num + ')"> <span class="glyphicon glyphicon-minus" aria-hidden="true"></button></div></div><p></p>';
    $("#c_pro").append(add);
}

function del_prog(num) {
    $("#d_prog" + num).remove();
}

function c_add_cours() {
    var data = {};
    var code = document.getElementById("c_code").value;
    var type = document.getElementById("c_type").value;
    var aff = document.getElementById("c_aff").value;
    var fil = Array();
    var s = 0;
    for (i = 0; i < document.getElementById("c_fil").length; i++) {
        if (document.getElementById("c_fil").options[i].selected) {
            fil[s++] = document.getElementById("c_fil").options[i].value;
        }
    }
    var cre = document.getElementById("c_cre").value;
    var imp = document.getElementById("c_imp").value;

    data.code = code.toUpperCase();
    data.type = type;
    data.affectation = aff;
    if (fil.length === 0) {
        data.filiere = null;
    } else {
        data.filiere = fil;
    }
    data.credit = cre;
    data.importance = imp;

    data.wording = document.getElementById("c_word").value;
    data.description = document.getElementById("c_desp").value;
    var prog = Array();

    var num = document.getElementsByClassName("pro_p").length;
    for (i = 0; i < num; i++) {
        prog[i] = document.getElementById("c_prog" + i).value;
    }
    data.programme = prog;
    data.mark = 5;

    var post_d = {
        "data" : Array(data)
    };
    r_key = document.getElementById("key").value;
    $.ajax({
        type : 'POST',
        url : "http://xzy.freeboxos.fr:8080/cours?key=" + r_key,
        xhrFields : {
            withCredentials : true
        },
        data : JSON.stringify(post_d),
        contentType : "application/json",
        headers : {
            Accept : "application/json"
        },
        success : function (r) {
            alert("Added!")
            index_add_cours();
        },
        error : function (r) {
            alert(r.responseJSON.error_info);
        }
    });

}
