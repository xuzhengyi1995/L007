var db_class = require("./db_class");

var database = db_class();


function c_cours(){
};

//add a cours into the database
c_cours.prototype.add_cours = function (data) {
    database.insert("cours", data);
    return true;
};

//get cours 
c_cours.prototype.get_cours = function (query, project, callback) {
    database.find("cours", query , project, function (p_data) {
        callback(p_data);
    });
};

//add a note for a cours
c_cours.prototype.add_note = function (s_code, s_note, s_count, is_update) {
    database.find("cours", { code: s_code }, { code: 1, mark: 1 }, function (f_data) {
        var old_note = f_data[0].mark;
        if (is_update) {
            var new_note = old_note + (s_note / s_count);
        }
        else {
            var new_note = old_note + (s_note - old_note) / s_count;
        }
        database.update("cours", { code: s_code }, { mark: new_note });
    });
    return true;
};

module.exports = function (){
    return new c_cours;
}

