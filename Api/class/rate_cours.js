//Rate a cours or update a note of a cours
//One email can only rate a cours one time
var db_class = require("./db_class");
var cousr = require('./get_cours.js');

/******************
 *code:   string,  cours code
 *note:   integer, given note
 *email:  string,  user email
 *update: boolean, is_update
 ******************/
function rate_cours(code, note, email, update){
    this.doc = 'rate';
    this.cours_col = 'cours';

    this.code = code;
    this.note = note;
    this.email = email;
    this.update = update;
    
    this.filiter = { "email": this.email, "code": this.code };
    this.filiter_code = { "code": this.code };
    this.insert_data = { "email": this.email, "code": this.code , "note": this.note, "time": Date.now() };
    this.update_data = { "note": this.note , "time": Date.now() };
    this.database = db_class();

    this.cours = cousr();
    this.old_note = 0;
    this.check_all();
};

//check the given information
rate_cours.prototype.check_all = function (){
    this.database.count(this.cours_col, this.filiter_code, function (num) {
        if (num === 0) {
            throw new Error("ERROR_CODE_COURS_NOT_FOUND");
        }
    });
    if (this.note < 1 || this.note > 10) {
        throw new Error("ERROR_NOTE_OUT_OF_RANGE");
    }
    if (this.email === null) {
        throw new Error("ERROR_NO_SUCH_SESSION");
    }
}

//check is this student has rated the cours
rate_cours.prototype.check_is_rated = function (callback) {
    this.database.count(this.doc, this.filiter, function (num) {
        if (num === 0) {
            callback(false);
        }
        else {
            callback(true);
        }
    });
};

//update the cours note in cours database
rate_cours.prototype.update_cours_database = function (is_update) {
    var ob = this;
    this.database.count(this.doc, this.filiter_code, function (num) {
        ob.cours.add_note(ob.code, ob.note - ob.old_note, num + 1, is_update);
    });
};

//add a new rate into the database and call update_cours_database
rate_cours.prototype.give_new_rate = function () {
    this.database.insert(this.doc, this.insert_data);
    this.update_cours_database(false);
    return true;
};

//update a note
rate_cours.prototype.update_rate = function () {
    var ob = this;
    ob.database.find(ob.doc, ob.filiter, { note: 1, time: 1 }, function (f_data) {
        ob.old_note = f_data[0].note;
    });
    this.database.update(this.doc, this.filiter, this.update_data);
    ob.update_cours_database(true);
};

//get a old note
rate_cours.prototype.get_old_note = function (callback) {
    this.database.find(this.doc, this.filiter, { note: 1, time: 1 }, function (f_data) {
        callback({ "is_rated": true, "old_note": f_data[0].note, "time": f_data[0].time });
    });
};

//give all information and run it 
rate_cours.prototype.run_it = function (callback) {
    var ob = this;
    this.check_is_rated(function (is_rated) {
        if (is_rated) {
            if (ob.update) {
                ob.update_rate();
                callback({ "is_rated": true, "update": true });
            }
            else {
                ob.database.find(ob.doc, ob.filiter, { note: 1, time: 1 }, function (f_data) {
                    callback({ "is_rated": true, "update": false, "old_note": f_data[0].note, "time": f_data[0].time });
                });
            }
        }
        else {
            ob.give_new_rate();
            callback({ "is_rated": false, "insert": true });
        };
    });
};

module.exports = function (code, note, email, update) {
    return new rate_cours(code, note, email, update);
};