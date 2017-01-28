var mysql = require('mysql');
var connectionSQL = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'incremental',
    multipleStatements: true
});

connectionSQL.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database");
        if (err.code == 'ER_BAD_DB_ERROR') {
            var selectQuery = "create database incremental";
            connectionSQL2.query(
                selectQuery,
                function findAll(error, results, fields) {
                    if (error) {
                        var myName = arguments.callee.toString();
                        myName = myName.substr('function '.length);
                        myName = myName.substr(0, myName.indexOf('('));
                        console.log(myName + '/ERROR: Error while performing Query : ' + error);
                        console.log(selectQuery);
                        console.log('-------------------------------');
                    }
                    else {
                    }
                });
        }
    }
});
