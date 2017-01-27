var express = require('express');
var datetime = require('node-datetime');
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


io.sockets.on('connection', function (socket) {
    // insertData(testInsert);
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
            // console.log(array);
            socket.emit("loaded_user", array);
        });

    });

});

server.listen(8080);

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}

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
    reserve.stock = 70;
    Crud.insert(reserve);

    reserve.idVillage = 1;
    reserve.idRessource = 2;
    reserve.stock = 10;
    Crud.insert(reserve);

    var population = Object.create(Population);
    population.idVillage = 1;
    population.max = 10;
    population.actual = 10;
    population.evolution = 100;
    population.disponible = 8;
    Crud.insert(population);

    var slot = Object.create(Slot);
    slot.idBatiment = 5;
    slot.idVillage = 1;
    slot.employes = 0;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 15;
    slot.idVillage = 1;
    slot.employes = 1;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 24;
    slot.idVillage = 1;
    slot.employes = 0;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 32;
    slot.idVillage = 1;
    slot.employes = 1;
    Crud.insert(slot);

    var slot = Object.create(Slot);
    slot.idBatiment = 38;
    slot.idVillage = 1;
    slot.employes = null;
    Crud.insert(slot);

    console.log('jeu de données inséré');

}

function insertData(callback) {

    var ressource = Object.create(Ressource);
    ressource.name = 'or';
    Crud.insert(ressource);

    var ressource = Object.create(Ressource);
    ressource.name = 'nourriture';
    Crud.insert(ressource);

    //-----------------------------------------------------------------

    var counter = 1;
    do {
        var batiment3 = Object.create(Batiment);
        batiment3.lvl = 1 * counter;
        batiment3.name = "mine d''or";
        batiment3.value = 15 * counter;
        batiment3.prix = 5 * counter * 1.5;
        batiment3.type = 'batiment';
        batiment3.imageName = 'mine_d_or.jpg';
        batiment3.idRessource = 1;
        Crud.insert(batiment3);
        counter++;
    } while (counter != 10);


    var counter = 1;
    do {
        var batiment2 = Object.create(Batiment);
        batiment2.lvl = 1 * counter;
        batiment2.name = "or";
        batiment2.value = 7 * counter * 1.2;
        batiment2.prix = 5 * counter * 1.5;
        batiment2.type = 'ressource';
        batiment2.imageName = 'or.jpg';
        batiment2.idRessource = 1;
        Crud.insert(batiment2);
        counter++;
    } while (counter != 10);


    //------------------------------------------------------------

    var counter = 1;
    do {
        var batiment = Object.create(Batiment);
        batiment.lvl = 1 * counter;
        batiment.name = 'entrepot';
        batiment.value = 15 * counter;
        batiment.prix = 5 * counter * 1.5;
        batiment.type = 'batiment';
        batiment.imageName = 'entrepot.jpg';
        batiment.idRessource = 2;
        Crud.insert(batiment);
        counter++;
    } while (counter != 10);

    //----------------

    var counter = 1;
    do {
        var batiment2 = Object.create(Batiment);
        batiment2.lvl = 1 * counter;
        batiment2.name = 'champ de ble';
        batiment2.value = 5 * counter * 1.2;
        batiment2.prix = 5 * counter * 1.5;
        batiment2.type = 'ressource';
        batiment2.imageName = 'ble.jpg';
        batiment2.idRessource = 2;
        Crud.insert(batiment2);
        counter++;
    } while (counter != 10);

    //----------------------------

    var counter = 1;
    do {
        var batiment3 = Object.create(Batiment);
        batiment3.lvl = 1 * counter;
        batiment3.name = 'Maison';
        batiment3.value = 5 * counter;
        batiment3.prix = 5 * counter * 1.5;
        batiment3.type = 'habitation';
        batiment3.imageName = 'maison.jpg';
        Crud.insert(batiment3);
        counter++;
    } while (counter != 10);

    //----------------------------


    callback();
}

function dateDiff(date1, date2) {
    var diff = {}                           // Initialisation du retour
    var tmp = date2 - date1;

    tmp = Math.floor(tmp / 1000);             // Nombre de secondes entre les 2 dates
    diff.sec = tmp % 60;                    // Extraction du nombre de secondes

    tmp = Math.floor((tmp - diff.sec) / 60);    // Nombre de minutes (partie entière)
    diff.min = tmp % 60;                    // Extraction du nombre de minutes

    tmp = Math.floor((tmp - diff.min) / 60);    // Nombre d'heures (entières)
    diff.hour = tmp % 24;                   // Extraction du nombre d'heures

    tmp = Math.floor((tmp - diff.hour) / 24);   // Nombre de jours restants
    diff.day = tmp;

    return diff / 1000;
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



