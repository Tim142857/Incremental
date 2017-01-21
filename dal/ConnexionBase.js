var mysql = require('mysql');
var connectionSQL = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incremental"
});
connectionSQL.connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database");
    }
});
