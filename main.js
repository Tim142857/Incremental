var express = require('express');
var path = require('path');
var http = require('http');
var cookieParser = require('cookie-parser');
var app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caract�res HTML (s�curit� �quivalente � htmlentities en PHP)
    fs = require('fs');
app.set('port', 8080);
app.use(cookieParser());

//autoload
eval(fs.readFileSync('../incremental/config/autoload.js') + '');

var clients = [];

var globalSocket = null;

//----------------------------- TRAITEMENT PRINCIPAL ------------------------------------


//Fonction loop over time
//recupoere la liste des connectes
//Pour chaque connecte
//Pour chaque ressource
//Calculer combien ont été produit
//Calculer nouveau stock
//Evaluer evolution pop
//donner nouvelle pop
//update base
//declencher event


io.sockets.on('connection', function (socket) {
    // var refreshId = setInterval(function () {
    //     console.log('hey!');
    //     socket.emit('test');
    // }, 50);
    //insertData(testInsert);
    //J'enregistre la nouvelle connexion dans mes clients
    clients[socket.id] = socket;
    // console.log('nouvelle connexion de ' + socket.id);

    socket.on('disconnect', function () {
        // console.log('déconnexion');
        var i = clients.indexOf(socket);
        clients.splice(i, 1);
    });

    if (clients.length > 0) {
        globalSocket = clients[clients.length - 1];
    } else {
        globalSocket = socket;
    }

    socket.on('load_user', function (idPlayer) {
        UserController.loadUser(idPlayer, function (array) {
            console.log(array);
            socket.emit("loaded_user", array);
        });

    });

});


server.listen(8080);

function testInsert() {


    var player = Object.create(Player);
    player.name = 'Tim';
    player.password = '1234';
    Crud.insert(player);

    var village = Object.create(Village);
    village.idPlayer = 1;
    Crud.insert(village);

    var reserve = Object.create(Reserve);
    reserve.idVillage = 1;
    reserve.idRessource = 1;
    reserve.stock = 10;
    Crud.insert(reserve);

    reserve.idVillage = 1;
    reserve.idRessource = 2;
    reserve.stock = 100;
    Crud.insert(reserve);

    var population = Object.create(Population);
    population.idVillage = 1;
    population.max = 10;
    population.actual = 5;
    population.evolution = 1;
    Crud.insert(population);

    var slot = Object.create(Slot);
    slot.idBatiment = 1;
    slot.idVillage = 1;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 4;
    slot.idVillage = 1;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 7;
    slot.idVillage = 1;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 10;
    slot.idVillage = 1;
    Crud.insert(slot);

}

function insertData(callback) {

    var ressource = Object.create(Ressource);
    ressource.name = 'nourriture';
    Crud.insert(ressource);

    var ressource = Object.create(Ressource);
    ressource.name = 'or';
    Crud.insert(ressource);

    var batiment = Object.create(Batiment);
    batiment.lvl = 1;
    batiment.name = 'entrepot';
    batiment.value = 15;
    batiment.prix = 0;
    batiment.type = 'batiment';
    batiment.imageName = 'entrepot.jpg';
    batiment.idRessource = 1;
    Crud.insert(batiment);

    batiment.lvl = 2;
    batiment.value = 25;
    batiment.prix = 10;
    Crud.insert(batiment);

    batiment.lvl = 3;
    batiment.value = 50;
    batiment.prix = 25;
    Crud.insert(batiment);

    //----------------

    var batiment2 = Object.create(Batiment);
    batiment2.lvl = 1;
    batiment2.name = 'champ de ble';
    batiment2.value = 5;
    batiment2.prix = 0;
    batiment2.type = 'ressource';
    batiment2.imageName = 'ble.jpg';
    batiment2.idRessource = 1;
    Crud.insert(batiment2);

    batiment2.lvl = 2;
    batiment2.value = 10;
    batiment2.prix = 10;
    Crud.insert(batiment2);

    batiment2.lvl = 3;
    batiment2.value = 15;
    batiment2.prix = 15;
    Crud.insert(batiment2);

    //----------------------------

    var batiment3 = Object.create(Batiment);
    batiment3.lvl = 1;
    batiment3.name = "mine d''or";
    batiment3.value = 15;
    batiment3.prix = 0;
    batiment3.type = 'batiment';
    batiment3.imageName = 'mine_d_or.jpg';
    batiment3.idRessource = 2;
    Crud.insert(batiment3);

    batiment3.lvl = 2;
    batiment3.value = 25;
    batiment3.prix = 10;
    Crud.insert(batiment3);

    batiment3.lvl = 3;
    batiment3.value = 50;
    batiment3.prix = 25;
    Crud.insert(batiment3);

    //----------------

    var batiment2 = Object.create(Batiment);
    batiment2.lvl = 1;
    batiment2.name = "or";
    batiment2.value = 5;
    batiment2.prix = 0;
    batiment2.type = 'ressource';
    batiment2.imageName = 'or.jpg';
    batiment2.idRessource = 2;
    Crud.insert(batiment2);

    batiment2.lvl = 2;
    batiment2.value = 10;
    batiment2.prix = 10;
    Crud.insert(batiment2);

    batiment2.lvl = 3;
    batiment2.value = 15;
    batiment2.prix = 15;
    Crud.insert(batiment2);

    callback();
}


//
// function autoload(fnCallback) {
//     var appPathBase = "../incremental";
//     var arrayToLoad = ['dal', 'model'];
//     var array FilesToLoad=[];
//     for (var key in arrayToLoad) {
//         var appPath = appPathBase + '/' + arrayToLoad[key] + '/';
//         console.log(appPath);
//         fs.readdir(appPath, function (err, files) {
//             if (err) {
//                 console.log("Could not list the directory: " + err);
//             }
//             else {
//                 files.forEach(function (file) {
//                     arrayToLoad.push(appPath+file);
//                 })
//             }
//         });
//     }
//
//     fnCallback();
// }


//     var firstResult;
//     // D�s qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
//     socket.on('nouveau_client', function (pseudo) {
//
//         var selectQuery = 'SELECT * FROM message ORDER BY date DESC LIMIT 3';
//         mySqlClient.query(
//             selectQuery,
//             function select(error, results, fields) {
//                 if (error) {
//                     console.log(error);
// //                        mySqlClient.end();
//                     return;
//                 }
//                 if (results.length > 0) {
//                     io.to(socket.id).emit('chargementsDerniersMessages', results);
//                 } else {
//                     console.log("Pas de données");
//                 }
// //                    mySqlClient.end();
//             }
//         );
//         pseudo = ent.encode(pseudo);
//         socket.pseudo = pseudo;
//         socket.broadcast.emit('nouveau_client', pseudo);
//     });
//
//     // D�s qu'on re�oit un message, on r�cup�re le pseudo de son auteur et on le transmet aux autres personnes
//     socket.on('message', function (message) {
//         message = ent.encode(message);
//
//         // For todays date;
//         // For todays date;
//         Date.prototype.today = function () {
//             return this.getFullYear() + "-" + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "-" + ((this.getDate() < 10) ? "0" : "") + this.getDate();
//         };
//
//
// // For the time now
//         Date.prototype.timeNow = function () {
//             return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
//         };
//
//         var datetime = new Date().today() + " " + new Date().timeNow();
//
//         var selectQuery = 'INSERT INTO message (id, pseudo, message, date) VALUES (NULL,\'' + socket.pseudo + '\',\' ' + message + '\', \'' + datetime + '\');';
//         console.log('query:' + selectQuery);
//         mySqlClient.query(
//             selectQuery,
//             function select(error, results, fields) {
//                 if (error) {
//                     console.log(error);
// //                        mySqlClient.end();
//                     return;
//                 }
// //                    mySqlClient.end();
//             }
//         );
//         socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
//     });
//
//     socket.on('disconnect', function () {
//         socket.broadcast.emit('new_disconnect', socket.pseudo);
//     });
//
//     socket.on('change_pseudo', function (new_pseudo) {
//         old_pseudo = socket.pseudo;
//         new_pseudo = ent.encode(new_pseudo);
//         socket.pseudo = new_pseudo;
//         socket.broadcast.emit('change_pseudo', {new_pseudo: new_pseudo, old_pseudo: old_pseudo});
//     });
//
//     socket.on('poke', function (pseudo, pseudoVise) {
//         socket.broadcast.emit('poke_lance', {pseudo: pseudo, pseudoVise: pseudoVise});
//     });



