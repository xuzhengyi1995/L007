//verify the rules for the coming cursus Json
var db_class = require("./db_class");
var ObjectID = require('mongodb').ObjectID;

function v_rules(_data){
    this.data = _data;
    this.database = new db_class();
    this.rules = new Array();
};

//get the rules from the database by id
v_rules.prototype.get_rules = function (callback) {
    var f = this.data.r_id;
    //console.log(f);
    this.database.find("rules", { "_id": ObjectID(f) }, {}, function (p_data) {
        callback(p_data);
    });
};

//check and give the data
v_rules.prototype.check_it = function (callback){
    var cursus = this.data.elems;
    this.get_rules(function (data) {
        var i = 0;
        var s = 0;
        var sum = {};
        var utt = {};
        var exist = {};
        var exist_all = {};
        var all_cours_code = {};
        sum['BR'] = {};
        utt['BR'] = {};
        exist['BR'] = {};
        var rules = data[0].rules;
        while (i < rules.length) {
            var aff = rules[i].affectation;
            var cat = rules[i].check.split(/[(,),+]/);
            if (!sum.hasOwnProperty(aff)) {
                sum[aff] = {};
                utt[aff] = {};
                exist[aff] = {};
            }
            var j = 0;
            for (j = 0; j < cat.length; j++) {
                if (!sum[aff].hasOwnProperty(cat[j])) {
                    sum[aff][cat[j]] = 0;
                    utt[aff][cat[j]] = 0;
                    if ((aff === 'TCBR' || aff === 'FCBR')) {
                        sum['BR'][cat[j]] = 0;
                        utt['BR'][cat[j]] = 0;
                    }
                }
            }
            ++i;
        }

        i = 0;
        while (i < cursus.length) {
            var cat = cursus[i].categorie;
            var aff = cursus[i].affectation;
            var cre = cursus[i].credit;
            var is_utt = cursus[i].utt;
            var res = cursus[i].resultat;
            all_cours_code[cursus[i].sigle] = true;
            if (!exist[aff].hasOwnProperty(cat)) {
                exist[aff][cat] = 'ok';
                exist_all[cat] = 'ok';
                if ((aff === 'TCBR' || aff === 'FCBR') && !exist['BR'].hasOwnProperty(cat)) {
                    exist['BR'][cat] = 'ok';
                }
            }
            
            if (res != 'F' && res != 'ABS') {
                sum[aff][cat] += parseInt(cre);
                if (aff === 'TCBR' || aff === 'FCBR') {
                    sum['BR'][cat] += parseInt(cre);
                }
                if (is_utt === 'Y') {
                    utt[aff][cat] += parseInt(cre);
                    if (aff === 'TCBR' || aff === 'FCBR') {
                        utt['BR'][cat] += parseInt(cre);
                    }
                }
                s += parseInt(cre);
            }
            ++i;
        }
        
        i = 0;
        var result = new Array();

        while (i < rules.length) {
            var r_aff = rules[i].affectation;
            result[i] = {};
            result[i]["rule"] = rules[i];
            var t = rules[i].check;
           var  p = t.split(/[(,),+]/);
            if (rules[i].type === 'SUM') {
                if (p.length === 1) {
                    if (p[0] === 'ALL') {
                        result[i]["already"] = s;
                        if (rules[i].credit <= s) {
                            result[i]["ok"] = "yes";
                            result[i]["remains"] = 0;
                        }
                        else {
                            result[i]["ok"] = "no";
                            result[i]["remains"] = rules[i].credit - s;
                        }
                    }
                    else {
                        result[i]["already"] = sum[r_aff][p[0]];
                        if (rules[i].credit <= sum[r_aff][p[0]] && r_aff != undefined) {
                            result[i]["ok"] = "yes";
                            result[i]["remains"] = 0;
                        }
                        else {
                            result[i]["ok"] = "no";
                            result[i]["remains"] = rules[i].credit - sum[r_aff][p[0]];
                        }
                    }
                }
                else {
                    var s_mult = 0;
                    if (p[0] === 'UTT') {
                        s_mult = utt[r_aff][p[1]] + utt[r_aff][p[2]];
                    } else {
                        s_mult = sum[r_aff][p[0]] + sum[r_aff][p[1]];
                    }
                    result[i]["already"] = s_mult
                    if (rules[i].credit <= s_mult && r_aff != undefined) {
                        result[i]["ok"] = "yes";
                        result[i]["remains"] = 0;
                    }
                    else {
                        result[i]["ok"] = "no";
                        result[i]["remains"] = rules[i].credit - s_mult;
                    }
                }
            }
            else {
                if (rules[i].type === 'EXIST') {
                    if (r_aff === 'UTT') {
                        t = exist_all[p[0]];
                    }
                    else {
                        t = exist[r_aff][p[0]];
                    }
                    if (t != undefined) {
                        result[i]["ok"] = "yes";
                        result[i]["remains"] = 0;
                    }
                    else {
                        result[i]["ok"] = "no";
                        result[i]["remains"] = p[0];
                    }
                }
            }
            if (result[i]["already"] === undefined || isNaN(result[i]["already"])) {
                result[i]["already"] = 0;
                result[i]["remains"] = rules[i].credit;
            }
            ++i;
        }
        callback(result, all_cours_code);
        //console.log("RESULT : ", result);
        //console.log("SUM Credit :",sum);
        //console.log("Credit in UTT :",utt);
        //console.log("EXIST :",exist);
    });
}
module.exports = function (_data) {
    return new v_rules(_data);
};