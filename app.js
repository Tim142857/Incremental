var app = require('express')(),
        server = require('http').createServer(app),
        io = require('socket.io').listen(server),
        ent = require('ent'), // Permet de bloquer les caract�res HTML (s�curit� �quivalente � htmlentities en PHP)
        fs = require('fs');

var mysql = require('mysql');
var mySqlClient = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "incremental"
});


// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket, pseudo) {


    var firstResult;
    // D�s qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('nouveau_client', function (pseudo) {

        var selectQuery = 'SELECT * FROM message ORDER BY date DESC LIMIT 3';
        mySqlClient.query(
                selectQuery,
                function select(error, results, fields) {
                    if (error) {
                        console.log(error);
//                        mySqlClient.end();
                        return;
                    }
                    if (results.length > 0) {
                        io.to(socket.id).emit('chargementsDerniersMessages', results);
                    } else {
                        console.log("Pas de données");
                    }
//                    mySqlClient.end();
                }
        );
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
    });

    // D�s qu'on re�oit un message, on r�cup�re le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message) {
        message = ent.encode(message);

        // For todays date;
        // For todays date;
        Date.prototype.today = function () {
            return this.getFullYear() + "-" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "-" + ((this.getDate() < 10) ? "0" : "") + this.getDate();
        };


// For the time now
        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        };

        var datetime = new Date().today() + " " + new Date().timeNow();

        var selectQuery = 'INSERT INTO message (id, pseudo, message, date) VALUES (NULL,\'' + socket.pseudo + '\',\' ' + message + '\', \'' + datetime + '\');';
        console.log('query:' + selectQuery);
        mySqlClient.query(
                selectQuery,
                function select(error, results, fields) {
                    if (error) {
                        console.log(error);
//                        mySqlClient.end();
                        return;
                    }
//                    mySqlClient.end();
                }
        );
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    });

    socket.on('disconnect', function () {
        socket.broadcast.emit('new_disconnect', socket.pseudo);
    });

    socket.on('change_pseudo', function (new_pseudo) {
        old_pseudo = socket.pseudo;
        new_pseudo = ent.encode(new_pseudo);
        socket.pseudo = new_pseudo;
        socket.broadcast.emit('change_pseudo', {new_pseudo: new_pseudo, old_pseudo: old_pseudo});
    });

    socket.on('poke', function (pseudo, pseudoVise) {
        socket.broadcast.emit('poke_lance', {pseudo: pseudo, pseudoVise: pseudoVise});
    });
});


server.listen(8080);

	