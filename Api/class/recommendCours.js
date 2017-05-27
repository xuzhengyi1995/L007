//Get recommend cours
var get_cours = require('./get_cours.js');

//reCours class
function reCours(data, filiere, all_cours_code, callback) {
    //all the cours in a cursus, we can not recommend the cours the student had already done
    this.all_cours_code = all_cours_code;
    this.callback = callback;
    //use for all the method know the progress
    this.i = 0;
    this.cours = new get_cours();
    //filiere
    this.fil = filiere;
    var i = 0;
    this.s = 0;
    this.remains = new Array();
    this.already_r = {};
    
    for (i = 0; i < data.length; i++) {
        if (data[i].ok === 'no') {
            var p = data[i].rule.check.split(/[(,),+]/);
            var c = Array();
            var cs = 0;
            for (k = 0; k < p.length; k++) {
                if (p[k] != 'UTT' && p[k] != '' && p[k] != ' ') {
                    c[cs++] = p[k];
                }
            }
            this.remains[this.s++] = {
                r_seq: i,
                type: data[i].rule.type,
                check: c,
                aff: data[i].rule.affectation,
                remain: data[i].remains,
                is_ok: false
            };
        }
    }
    this.rCours_final = new Array(this.remains.length);
    for (i = 0; i < this.remains.length; i++) {
        this.rCours_final[i] = new Array();
    }
    //console.log(this.remains);
    this.get_cours();
}

//get the cours fit the rules and call the r_process to give out the recommend cours
reCours.prototype.get_cours = function () {
    var i = 0;
    if (this.remains.length === 0) {
        this.callback({
            all_ok: true
        });
        return true;
    }
    //filiter to select the cours in database
    var filiter = {};
    i = this.i;
    var ob = this;
    if (this.remains[i].aff === 'BR') {
        if (this.remains[i].check[0] === 'ALL') {
            filiter = { type: false };
        }
        else {
            filiter = { $or: Array() };
            for (j = 0; j < this.remains[i].check.length; j++) {
                filiter.$or.push({ type: this.remains[i].check[j] });
            }
        }
    }
    else {
        filiter = { $and: [{ $or: Array() }, { affectation: this.remains[i].aff }] };
        for (j = 0; j < this.remains[i].check.length; j++) {
            filiter.$and[0].$or.push({ type: this.remains[i].check[j] });
        }
    }
    filiter = ({ $and: [{ $or: [{ filiere: this.fil }, { filiere: null }, { filiere: "LIB" }] }, filiter] });
    this.cours.get_cours(filiter, { code: 1, importance: 1, mark: 1, credit: 1, type: 1 }, function (c_data) {
        var k = 0;
        for (k = 0; k < c_data.length; k++) {
            c_data[k].score = parseInt(c_data[k].importance) + ((c_data[k].mark - 5) * 10);
        }
        c_data.sort(function (a, b) {
            return b.score - a.score;
        });
        ob.r_process(c_data, function (p_i) { if (p_i < ob.remains.length) { ob.get_cours(); } });
        if (ob.i === ob.remains.length) {
            ob.callback({
                recommend_list: ob.already_r,
                after_situation: ob.remains,
                cours_info: ob.rCours_final
            });
        }
    });
    
};

//r_process to give the recommend cours
reCours.prototype.r_process = function (cours,callback) {
    var k = 0;
    if (!this.remains[this.i].is_ok) {
        if (this.remains[this.i].type === 'EXIST') {
            while (k < cours.length && (!this.remains[this.i].is_ok)) {
                if ((!this.already_r.hasOwnProperty(cours[k].code)) && (!this.all_cours_code.hasOwnProperty(cours[k].code))) {
                    this.rCours_final[this.i] = cours[0];
                    this.remains[this.i].is_ok = true;
                    this.already_r[cours[k].code] = true;
                }
                ++k;
            }
        }
        else {
            if (this.remains[this.i].type === 'SUM') {
                while (k < cours.length && this.remains[this.i].remain > 0) {
                    if ((!this.already_r.hasOwnProperty(cours[k].code)) && (!this.all_cours_code.hasOwnProperty(cours[k].code))) {
                        this.already_r[cours[k].code] = true;
                        this.remains[this.i].remain -= cours[k].credit;
                        if (this.remains[this.i].remain <= 0) {
                            this.remains[this.i].is_ok = true;
                        }
                        this.rCours_final[this.i].push(cours[k]);
                        
                        for (l = 0; l < this.remains.length; l++) {
                            if (l != this.i) {
                                if (this.remains[l].aff === 'BR' || this.remains[l].aff === this.remains[this.i].aff) {
                                    var c_same_check = false;
                                    for (m = 0; m < this.remains[this.i].check.length; m++) {
                                        for (n = 0; n < this.remains[l].check.length; n++) {
                                            if (cours[k].type === this.remains[l].check[n]) {
                                                c_same_check = true;
                                                break;
                                            }
                                        }
                                    }//for check the same check
                                }//check credit can be use in another rule
                                
                                if (c_same_check || this.remains[l].check[0] === 'ALL') {
                                    c_same_check = false;
                                    this.remains[l].remain -= cours[k].credit;
                                    this.rCours_final[l].push(cours[k]);
                                    if (this.remains[l].remain <= 0) {
                                        this.remains[l].is_ok = true;
                                    }
                                }
                            }
                        }//check all rules
                    }//check if the cours has been selected
                    ++k;
                }//check all the cours
            }//type sum
            else {
                throw new Error("ERROR_UNKNOW_RULE_TYPE");
            }
        }
    }
    ++this.i;
    callback(this.i);
    //if (this.i === this.remains.length) {
       /* this.callback({
            recommend_list: this.already_r,
            after_situation: this.remains,
            cours_info: this.rCours_final
        });
        */
        //console.log(this.remains);
        //console.log(this.already_r);
        //console.log(this.rCours_final);
        //console.log(this.i);
    //};
}

module.exports = function (data, filiere, all_cours_code, callback) {
    return new reCours(data, filiere, all_cours_code, callback);
}