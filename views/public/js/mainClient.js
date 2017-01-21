$(document).ready(function () {

    //Connexon a socket.io
    var socket = io.connect('http://localhost:8080');
    socket.on('loaded_user', function (array) {
        console.log(array);
        hydratePage(array);
    });

    $("#btn-test").on('click', function () {
        var idPlayer = readCookie('idPlayer');
        socket.emit('load_user', idPlayer);
    });

    function createCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function pushToArray(array, name, val) {
        var obj = {};
        obj[name] = val;
        array.push(obj);
    }

    function hydratePage(array) {
        //Player
        $("#userName").text(array[0].name);

        //Population
        $("#actualPop").text(array[2].actual);
        $("#maxPop").text(array[2].actual);
        $("#evolutionPop").text(array[2].evolution);


        //Slots
        array[3].forEach(function (element) {
            $.get("/getBatiment/" + element.idBatiment, function (batiment) {
                var rowToAppend = 'row-' + batiment.type + 's';
                var html = " <div class='col-xs-3' id='batiment-" + batiment.id + "'>";
                html += "<img class='img-responsive img-circle' src='public/images/" + batiment.imageName + "' style='position: relative; border:10px solid black;'>";
                html += "<img class='img-responsive' src='public/images/info.png' style='width: 16%;height: 16%;position: absolute;top: -5%;left: 35%;'>";
                html += "<img class='img-responsive' src='public/images/upgrade.png' style='width: 15%;height: 15%;position: absolute;top: -4%;left: 52%;'> ";
                html += "</div>";
                $('#' + rowToAppend).append(html);

                //Recuperation de la capacite max de chaque ressource
                if (batiment.type == "batiment") {
                    createCookie('capacite-ressource-' + batiment.idRessource, batiment.value, 1);
                } else {
                    createCookie('production-ressource-' + batiment.idRessource, batiment.value, 1);
                }
            });
        });

        //Nourriture
        array[4].forEach(function (element) {

            var max = readCookie('capacite-ressource-' + element.idRessource);
            var production = readCookie('production-ressource-' + element.idRessource);

            //Recuperation du nom de la ressource
            var ressourceName = '';
            $.get("/getRessource/" + element.idRessource, function (ressource) {
                var ressourceName = ressource.name;
                ressourceName = ressourceName.toUpperCase();
                var html = "<div class='col-xs-3' id='ressource-" + element.idRessource + "-information'>";
                html += "<table class='table'>";
                html += "<tr>" + ressourceName + "</tr>";
                html += "<tr>";
                html += "<td>Stock :</td>";
                html += "<td id='actualFood'>" + element.stock + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Maximum :</td>";
                html += "<td id='maxFood'>" + max + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Production :</td>";
                html += "<td id='evolutionFood'>" + production + "</td>";
                html += "</tr>";
                html += "</table>";
                html += "<div>";
                $("#row-informations").append(html);
            });
        });
    }
})


//        //On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
//
//        var pseudo = prompt('Quel est votre pseudo?');
//        socket.emit('nouveau_client', pseudo);
//        document.title = pseudo + ' - ' + document.title;
//
//        function messageParser(element, index, array) {
//            insereMessage(element['pseudo'], element['message']);
//        }
//        ;
//        //Chargement derniers messages
//        socket.on('chargementsDerniersMessages', function (data) {
//            data.forEach(messageParser);
//        });
//
//        //Quand on recoit un message, on l'affiche
//        socket.on('message', function (data) {
//            insereMessage(data.pseudo, data.message);
//        });
//
//        //Quand un nouveau client se connecte, on affiche linfo
//        //})
//
//        socket.on('nouveau_client', function (pseudo) {
//            $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
//        })
//
//        // Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
//        $('#formulaire_chat').submit(function () {
//            var message = $('#message').val();
//            socket.emit('message', message); // Transmet le message aux autres
//            insereMessage(pseudo, message); // Affiche le message aussi sur notre page
//            $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
//            return false; // Permet de bloquer l'envoi "classique" du formulaire
//        });
//
//        //d�connexion d'un client
//        socket.on('new_disconnect', function (pseudo) {
//            $('#zone_chat').prepend('<p><b>' + pseudo + ' a quitt� le Chat !</b></p>');
//        })
//
//        //Changement d'un pseudo
//        socket.on('change_pseudo', function (data) {
//            $('#zone_chat').prepend('<p><em>' + data.old_pseudo + " s\'est renomm� en : " + data.new_pseudo + '</em></p>');
//        });
//
//        //Poke
//        $("#zone_chat").on("click", $(".pseudo"), function () {
//            return false;
//        });
//
//        function sendPoke(elmnt) {
//            var pseudoVise = elmnt.dataset.pseudo;
//            socket.emit('poke', pseudo, pseudoVise);
//        }
//
//        //Poke recu
//        socket.on('poke_lance', function (data) {
//            if (pseudo === data.pseudoVise) {
//                alert(data.pseudo + ' vous a envoy� un poke');
//            }
//        });
//
//        // Ajoute un message dans la page
//        function insereMessage(pseudo, message) {
//            $('#zone_chat').prepend('<p><strong><a href="#" onclick="sendPoke(this)" class="pseudo" data-pseudo="' + pseudo + '" >' + pseudo + '</a></strong> ' + message + '</p>');
//        }
//
//        $("#change_pseudo").on("click", function () {
//            var new_pseudo = prompt('Entrez votre nouveau pseudo: ');
//            pseudo = new_pseudo;
//            $('#zone_chat').prepend('<p><em>Vous vous �tes rennom� en ' + pseudo + '<em></p>');
//            socket.emit('change_pseudo', new_pseudo);
//            document.title = new_pseudo + ' - ' + document.title;
//            return false;
//        });

