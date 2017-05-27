var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer');
var request = require('request');
var cookieP = require('cookie-parser');
var csv_convert = require('./class/csv');
var db_class = require("./class/db_class");
var accepts = require('accepts')
var json2xml = require('json2xml');
var v_rules = require('./class/v_rules');
var fs = require('fs');
var c_cours = require('./class/get_cours.js');
var rate_cours = require('./class/rate_cours.js');
var reCours = require('./class/recommendCours.js');

var upload = multer();
var convert = csv_convert();
var database = db_class();
var cours = c_cours();
var user_info = {};

var port = 8080;
var req_opt = {
    baseUrl: 'http://xzy.freeboxos.fr/api/node_sid_info',
    json: true
};

//get json
app.use(bodyParser.json());

//get cookie
app.use(cookieP());

//domainMiddleware
app.use(require('express-domain-middleware'));


//log the request
app.use(function (req, res, next) {
    var time = new Date().toLocaleString();
    var log_string = time + "  IP:  " + req.ip + " Method: " + req.method + "  Url: " + req.originalUrl + "  Body: " + JSON.stringify(req.body);
    console.log(log_string);
    fs.appendFile("Api_log.log", log_string + '\r\n', 'utf-8', function (err) { if (err) { throw Error(err); } });
    res.set({ 'Access-Control-Allow-Origin': 'http://xzy.freeboxos.fr' });
    res.set({'Access-Control-Allow-Credentials': true});
    next();
});

//check user state
app.use(function (req, res, next) {
    if (req.method != 'OPTIONS') {
        request('/?sid=' + req.cookies.PHPSESSID + '&key=95aaf2c69f504de629bbdca0235bf881e9e4f3c7f6f2f343cef6142e2e671310c5c9e98c28c35dbd6252986efcd360d18e50989f8fcefcb83f05c544d3a06724', req_opt, function (r_err, r_res, r_body) {
            user_info = r_body;
            //console.log(user_info);
            var base = req.originalUrl.split(/[\/,?,&]/)[1];
            if (base === 'rate_cours') {
                if (user_info.logged_in != 'yes') {
                    throw new Error("ERROR_NOT_LOG_IN");
                }
            }
            if (base === 'cours' && req.method === 'POST') {
                if (user_info.logged_in != 'yes' || user_info.type != 'staff') {
                    throw new Error("ERROR_NO_AUTH");
                }
                if (req.query.key != user_info.xss) {
                    throw new Error("ERROR_XSS_ATTACK");
                }
            }
            if (base === 'rules' && req.method === 'POST') {
                if (user_info.logged_in != 'yes' || user_info.type != 'staff') {
                    throw new Error("ERROR_NO_AUTH");
                }
                if (req.query.key != user_info.xss) {
                    throw new Error("ERROR_XSS_ATTACK");
                }
            }
            next();
        });
    }
    else {
        res.set({ 'Access-Control-Allow-Methods': 'POST,GET,PUT,OPTIONS' });
        res.set({ 'Access-Control-Allow-Headers': 'content-type' });
        res.status(204);
        next();
    }

});

app.route('/rate_cours/:code')
//add or update a note
.post(function (req, res) {
    var data = req.body;
    request('/?sid=' + req.cookies.PHPSESSID + '&key=95aaf2c69f504de629bbdca0235bf881e9e4f3c7f6f2f343cef6142e2e671310c5c9e98c28c35dbd6252986efcd360d18e50989f8fcefcb83f05c544d3a06724', req_opt, function (r_err, r_res, r_body) {
        var rate_c = rate_cours(req.params.code, parseInt(data.note), r_body.email, false);
        rate_c.run_it(function (r) {
            res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
            res.send(r);
        });
    });
})

//get if the user has give a note to the cours
.get(function (req, res) {
    request('/?sid=' + req.cookies.PHPSESSID + '&key=95aaf2c69f504de629bbdca0235bf881e9e4f3c7f6f2f343cef6142e2e671310c5c9e98c28c35dbd6252986efcd360d18e50989f8fcefcb83f05c544d3a06724', req_opt, function (r_err, r_res, r_body) {
        var rate_c = rate_cours(req.params.code, 5, r_body.email, false);
        rate_c.check_is_rated(function (r) {
            res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
            if (r) {
                rate_c.get_old_note(function (rr) {
                    res.send(rr);
                });
            } else {
                res.send({ is_rated: r });
            };
        });
    });
})

//update a note
.put(function (req, res) {
    var data = req.body;
    request('/?sid=' + req.cookies.PHPSESSID + '&key=95aaf2c69f504de629bbdca0235bf881e9e4f3c7f6f2f343cef6142e2e671310c5c9e98c28c35dbd6252986efcd360d18e50989f8fcefcb83f05c544d3a06724', req_opt, function (r_err, r_res, r_body) {
        var rate_c = rate_cours(req.params.code, parseInt(data.note), r_body.email, true);
        rate_c.run_it(function (r) {
            res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
            res.send(r);
        });
    });
});


app.route(/^\/cours\/?\w*/)
//add a cours into the database
.post(function (req, res) {
    var data = req.body.data;
    for (i = 0; i < data.length; i++) {
        cours.add_cours(data[i]);
    }
    res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
    res.send({ is_error: false, error_info: null });
})

//get a cours
.get(function (req, res) {
    var accept = accepts(req);
    if (!req.query.detail || req.query.detail === 'false') {
        var project = { code: 1, type: 1, affectation: 1, filiere: 1, credit: 1, importance: 1, mark: 1 };
    }
    else {
        if (req.query.detail === 'true') {
            var project = {};
        }
        else {
            throw new Error("ERROR_PARAM");
        };
    };
    
    var f = req.path.split(/\//);
    var query = {$and:[{}]};
    var i = 2;
    while (f[i] != undefined) {
        query.$and[i - 1] = { $or: [{ code: f[i] }, { type: f[i] }, { affectation: f[i] }, { filiere: f[i] }] };
        ++i;
    };
    
    cours.get_cours(query, project, function (data) {
        switch (accept.type(['json', 'xml'])) {
            case 'json':
                res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
                r_data = { "data": data };
                res.send(r_data);
                break;
            case 'xml':
                res.set({ 'Content-Type': 'application/xml', 'Encodeing': 'utf8' });
                for (i = 0; i < data.length; i++) {
                    data[i]._id = data[i]._id.toString();
                };
                
                res.send(json2xml(data, { header: true }, "cours_") + "</root>");
                break;
            default:
                throw new Error("ERROR_ACCEPT_FORMAT");
        }
    });
});

//re=both,only,no
app.post('/v_rules', function (req, res) {
    res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
    var check = new v_rules(req.body);
    check.check_it(function (data, all_cours_code) {
        if (req.query.re === 'no' || !req.query.re) {
            res.send({ "commit": data });
        }
        else {
            var recommend = reCours(data, req.body.filiere, all_cours_code, function (re_data) {
                if (req.query.re === 'both') {
                    res.send({ "commit": data, "re_data": re_data });
                }
                else {
                    if (req.query.re === 'only') {
                        res.send({ "re_data": re_data });
                    }
                    else {
                        throw new Error("ERROR_PARAM");
                    }
                }
            });
        }
    });    
});
app.route('/rules')
//upload the csv of a rules, only can access by a login staff
.post(upload.single('csv'), function (req, res) {
    if (req.file.mimetype != "application/csv" && req.file.mimetype != "application/vnd.ms-excel" && req.file.mimetype != "text/csv") {
        throw new Error("ERROR_FILE_TYPE_ERROR");
    }
    res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
    r_json=convert.get_json(req.file.buffer.toString())
    convert.write_db();
    res.send(r_json);
})

//get all rules,detail=true(false)
.get(function (req, res) {
    var accept = accepts(req);
    if (!req.query.detail || req.query.detail === 'false') {
        var db_query = { name: 1 };
    }
    else {
        if (req.query.detail === 'true') {
            var db_query = {};
        }
        else {
            throw new Error("ERROR_PARAM");
        };
    };
    database.find("rules", {}, db_query, function (data) {
        switch (accept.type(['json', 'xml'])) {
            case 'json':
                res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
                r_data = { "data": data };
                res.send(r_data);
                break;
            case 'xml':
                res.set({ 'Content-Type': 'application/xml', 'Encodeing': 'utf8' });
                for (i = 0; i < data.length; i++) {
                    data[i]._id = data[i]._id.toString();
                };
                
                res.send(json2xml(data, { header: true }, "rules_") + "</root>");
                break;
            default:
                throw new Error("ERROR_ACCEPT_FORMAT");
        }
        
    });
});


app.use(function (err, req, res, next) {
    //console.error(err.stack);
    var time = new Date().toLocaleString();
    var log_string = "*ERROR:  " + time + "  IP:  " + req.ip + " Method: " + req.method + "  Url: " + req.originalUrl + "  Body: " + JSON.stringify(req.body) + "  ERROR_INFO:  " + err.message;
    console.error(log_string);
    var err_stack = "//**************************************//\r\n" + err.stack + "\r\n//**************************************//\r\n";
    fs.appendFile("Api_Error_log.log", log_string + '\r\n' + err_stack, 'utf-8', function (err) { if (err) { throw Error(err); } });

    res.set({ 'Content-Type': 'application/json', 'Encodeing': 'utf8' });
    res.status(500).send({ "is_error": true, "error_info": err.message });
});

app.listen(port, function () {
    console.log("Api started, listing on port: " + port);
});
