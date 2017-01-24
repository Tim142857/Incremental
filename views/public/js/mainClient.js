$(document).ready(function () {

    //-----------------------------------------  Constantes    ---------------------------------------------------------

    var refreshPeriode = 1000; //temps en ms entre chaque refresh

    //-----------------------------------------  Plugins   -------------------------------------------------------------

    $(document).tooltip({
        content: function () {
            return $(this).prop('title');
        }
    });


    //------------------------------------------    Socket    ----------------------------------------------------------
    //Connexon a socket.io
    var socket = io.connect('http://localhost:8080');

    var idPlayer = readCookie('idPlayer');
    socket.emit('load_user', idPlayer);

    socket.on('loaded_user', function (array) {
        console.log(array);

        hydratePage(array, function () {
            var refreshId = setInterval(function () {
                updateStock();
            }, refreshPeriode);
        });
    });
    socket.on("test", function () {
        console.log('hey!');
    })


    // -------------------------------------  Declenchements d'events --------------------------------------------------

    $("#btn-test").on('click', function () {
        var idPlayer = readCookie('idPlayer');
        socket.emit('load_user', idPlayer);
    });


    //--------------------------------------  Fonctions   --------------------------------------------------------------

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

    function htmlEncode(value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
    }

    function pushToArray(array, name, val) {
        var obj = {};
        obj[name] = val;
        array.push(obj);
    }

    function hydratePage(array, fn) {
        //Player
        $("#userName").text(array[0].name);

        //Population
        $(".actualPop").text(array[2].actual);
        $(".maxPop").text(array[2].actual);
        $(".evolutionPop").text(array[2].evolution);


        //Slots
        array[3].forEach(function (element) {
            $.get("/getBatiment/" + element.idBatiment, function (batiment) {
                var rowToAppend = 'row-' + batiment.type + 's';
                var html = " <div class='col-xs-3' id='batiment-" + batiment.id + "'>";
                html += "<img class='img-responsive img-circle' src='public/images/" + batiment.imageName + "' style='position: relative; border:10px solid black;'>";
                html += "<img class='img-responsive' src='public/images/info.png' title='<p>infos!</p>' style='width: 16%;height: 16%;position: absolute;top: -5%;left: 35%;'>";
                html += "<img class='img-responsive' src='public/images/upgrade.png' title='upgrade!' style='width: 15%;height: 15%;position: absolute;top: -4%;left: 52%;'> ";
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
                var html = "<div class='col-xs-3 ressource-informations' id='ressource-" + element.idRessource + "'>";
                html += "<table class='table'>";
                html += "<tr>" + ressourceName + "</tr>";
                html += "<tr>";
                html += "<td>Stock :</td>";
                html += "<td class='actual' data-actual='" + element.stock + "'>" + element.stock + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Maximum :</td>";
                html += "<td class='max'>" + max + "</td>";
                html += "</tr>";
                html += "<tr>";
                html += "<td>Production :</td>";
                html += "<td class='production'>" + production + "</td>";
                html += "</tr>";
                html += "</table>";
                html += "<div>";
                $("#row-informations").append(html);
            });
        });

        fn();
    }

    function updateStock(divRessource) {
        //get stock, prod, max
        //Calcul des ressources produites
        //ajout au stock
        //verifi si stock<=capcite max

        $(".ressource-informations").each(function (index, element) {
            var stock = parseFloat($(element).find('.actual').attr('data-actual'));
            var max = parseInt($(element).find('.max').text());
            var production = parseInt($(element).find('.production').text());
            var ressourcesProduites = production * refreshPeriode / 3600000;
            console.log('refreshPeriode:' + refreshPeriode);
            console.log('stock:' + stock);
            console.log('max:' + max);
            console.log('production:' + production);
            console.log(ressourcesProduites);
            stock += parseFloat(ressourcesProduites);
            console.log('new stock:' + stock);
            $(element).find('.actual').attr('data-actual', stock);
            $(element).find('.actual').text(parseInt(stock));


        });
        //
        // var refreshId = setInterval(function () {
        //     $(".ressource-informations").each(function (index, element) {
        //         // var test = $(element).find('.actual').text();
        //         // console.log(test);
        //         updateStock($(element));
        //     });
        // }, 1000);

    }

})
