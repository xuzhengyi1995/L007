var MongoClient = require('mongodb').MongoClient

var url = 'mongodb://192.168.1.26:27017/api';

function db_class() {
}

//insert a document into the database
db_class.prototype.insert = function (doc, data) {
    MongoClient.connect(url, function (err, db) {
        if(err!=null) throw new Error(err);
        
        var col = db.collection(doc.toString());
        col.insertOne(data, function (err, r) {
            if (err != null) throw new Error(err);
            db.close();
        });
    });
}

//find a document
db_class.prototype.find = function (doc, querry, prj, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err != null) throw new Error(err);
        
        var col = db.collection(doc.toString());
        col.find(querry).project(prj).toArray(function (err, docs) {
            if (err != null) throw new Error(err);
            if (typeof callback === 'function') callback(docs);
            db.close();
        });
    });
}

//count how many document are there
db_class.prototype.count = function (doc, querry, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err != null) throw new Error(err);

        var col = db.collection(doc.toString());
        col.count(querry, function (err, count) {
            if (err != null) throw new Error(err);
            if (typeof callback === 'function') callback(count);
            db.close();
        });
    });
};

//update a document
db_class.prototype.update = function (doc, querry, new_data, callback) {
    MongoClient.connect(url, function (err, db) {
        if (err != null) throw new Error(err);
        
        var col = db.collection(doc.toString());
        col.updateMany(querry, { $set: new_data }, function (err, r) {
            if (err != null) throw new Error(err);
            if (typeof callback === 'function') callback(r.result.n);
        });
    });
};
         

module.exports = function() {
    return new db_class;
};
