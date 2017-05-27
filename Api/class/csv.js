//Read rules csv file
var db_class = require("./db_class");

var database = db_class();

function csv() {
    this.clear();
};

//clear the var
csv.prototype.clear= function () {
    this.data = {
        "name": null,
        "rules": null
    };
    this.data['rules'] = Array();
}

//convert the csv to json
csv.prototype.get_json = function (file) {
    this.clear();
    this.arr = file.split(/[\r,\n,\r\n,;]/);
    s = 0;
    if (this.arr.length === 0) {
        throw new Error('ERROR_EMPTY_FILE');
    }

    for (i = 0; i < this.arr.length; i++) {
        if (this.arr[i] === 'LABEL') {
            this.data['name'] = this.arr[++i];
        }
        
        reg = RegExp(/^R*[0-9]/);
        if (reg.exec(this.arr[i])) {
            if (this.data['rules'][i] === undefined) {
                this.data['rules'].push({
                    "type": null,
                    "check": null,
                    "affectation": null,
                    "credit": null
                });
            }   
            
            this.data['rules'][s]['type'] = this.arr[++i];
            this.data['rules'][s]['check'] = this.arr[++i];
            this.data['rules'][s]['affectation'] = this.arr[++i];
            this.data['rules'][s]['credit'] = this.arr[++i];
            ++s;
        }
    }
    
    if ((this.data['name'] === null)||(this.data['rules'].length===0)) {
        throw new Error('ERROR_FILE_FORMAT');
    }
    return this.data;
};

//write the json into the database
csv.prototype.write_db = function (){
    database.insert("rules", this.data);
    return true;
}

module.exports = function () {
    return new csv();
};
