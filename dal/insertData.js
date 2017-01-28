var mysql = require('mysql');
var connectionSQL2 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

checkDBExist(function (bool) {
    if (!bool) {
        createDataBase(function () {
            connectionSQL = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: 'incremental',
                multipleStatements: true
            });
            createTables(insertData);
        });
    }
});

function createDataBase(callback) {
    var selectQuery = "create database if not exists incremental";

    connectionSQL2.query(
        selectQuery,
        function createDataBase(error, results, fields) {
            if (error) {
                var myName = arguments.callee.toString();
                myName = myName.substr('function '.length);
                myName = myName.substr(0, myName.indexOf('('));
                console.log(myName + '/ERROR: Error while performing Query : ' + error);
                console.log(selectQuery);
                console.log('-------------------------------');
            }
            else {
                console.log('création de la base...');
                callback();
            }
        });
}

function checkDBExist(callback) {
    var selectQuery = "show databases like '" + db_name + "'";
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
                var myBool = false;
                if (results.length == 1) {
                    return true;
                } else {
                    console.log("db n'existe pas");
                }
                callback(myBool);
            }
        });
}

function createTables(callback) {
    fs.readFile('scriptBDD', 'utf8', function (err, contents) {

        var selectQuery = contents;
        connectionSQL.query(
            selectQuery,
            function createTables(error, results, fields) {
                if (error) {
                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log(myName + '/ERROR: Error while performing Query : ' + error);
                    // console.log(selectQuery);
                    console.log('-------------------------------');
                }
                else {
                    console.log('création des tables...');
                    callback();
                }
            });
    });
}
