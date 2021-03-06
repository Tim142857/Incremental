$(document).ready(function () {

    //-----------------------------------------  Constantes    ---------------------------------------------------------

    var refreshPeriode = 1000; //temps en ms entre chaque refresh

    var idPlayer = null;
    var idVillage = null;
    var idPopulation = null;

    var hydratedPage = false;

    //-----------------------------------------  Plugins   -------------------------------------------------------------


    //------------------------------------------    Socket    ----------------------------------------------------------

    //Connexon a socket.io
    var socket = io.connect();

    var idPlayer = readCookie('idPlayer');

    socket.emit('load_user', idPlayer);

    socket.on('loaded_user', function (array) {
        console.log(array);

        hydratePage(array, function () {
            timerUpdate();
        });
    });

    socket.on("test", function () {
        $.get("/test/", function (batiment) {
        });
    });

    socket.on('error', function (error_message) {
        alert(error_message);
    })


// -------------------------------------  Declenchements d'events --------------------------------------------------

    $("#btn-test").on('click', function () {
        socket.emit('load_user', idPlayer);
    });

    $(document).delegate(".arrow-employes", 'click', function () {
        var element = $(this);
        var idSlot = element.closest(".div-ressource").attr('data-idslot');
        var sens = null;
        if ($(this).hasClass('arrow-up')) {
            sens = 1;
        } else {
            sens = -1;
        }
        $.get("/updateEmployes/" + sens + "/" + idSlot + '/' + idPopulation, function (array) {
            if (array[0] == 'success') {
                var employes = parseInt(element.closest(".slot-employes").find('p').text()) + sens;
                element.closest(".slot-employes").find('p').text(employes);

                var popDispo = parseInt($(".disponiblePop").text()) + (-sens);
                $(".disponiblePop").text(popDispo);
                if (popDispo == 0) {
                    $(".arrow-up").each(function (index, element) {
                        $(element).addClass("hidden");
                    });
                }
                else {
                    $(".arrow-up").each(function (index, element) {
                        $(element).removeClass("hidden");
                    });
                    $(element).parent().find('.arrow-down').removeClass('hidden');
                }

                if ($(element).hasClass('arrow-down')) {
                    if (employes == 0) {
                        $(element).addClass('hidden');
                    }
                }

                var idRessource = $(element).closest(".div-ressource").attr('data-idressource');
                var prod = parseInt($('#ressource-' + idRessource).find('.production').attr('data-productionbrute'));
                prod = prod * parseInt(employes);
                $('#ressource-' + idRessource).find('.production').text(prod);

            } else {
                alert('error');
            }
        });

    });

    $(document).delegate('.btn-infos', 'mouseleave', function () {
        $(this).parent().find('.description').addClass('hidden');
    });

    $(document).delegate('.btn-infos', 'mouseover', function () {
        $(this).parent().find('.description').removeClass('hidden');
    });

    $(document).delegate('.btn-upgrade', 'click', function () {
        var idSlot = $(this).closest(".div-ressource").attr('data-idslot');
        console.log(idSlot);
        $.get("/upgradeBatiment/" + idSlot, function (message) {
            console.log(message);
            socket.emit('load_user', idPlayer);
        });
    })

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
        // console.log(hydratedPage);
        if (hydratedPage) {
            resetPage();
        }
        if (hydratedPage == false) {
            hydratedPage = true;
        }
        // console.log(hydratedPage);
        //Player
        $("#userName").text(array[0].name);

        //Population
        idPopulation = array[2].id;
        $(".totalPop").text(array[2].actual);
        $(".totalPop").attr("data-totalPop", array[2].actual);
        $(".maxPop").text(array[2].max);
        $(".disponiblePop").text(array[2].disponible);
        $(".evolutionPop").text(array[2].evolution);


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
                html += "<td class='production' data-productionbrute='" + production + "'>" + production + "</td>";
                html += "</tr>";
                html += "</table>";
                html += "<div>";
                $("#row-informations").append(html);
            });
        });

        //Slots
        array[3].forEach(function (element) {
            $.get("/getBatiment/" + element.idBatiment, function (batiment) {
                var rowToAppend = 'row-' + batiment.type + 's';
                // console.log(rowToAppend);
                var html = " <div class='col-xs-3 div-ressource' data-idRessource='" + batiment.idRessource + "' data-idslot='" + element.id + "' data-value='" + batiment.value + "' id='batiment-" + batiment.id + "'>";
                html += "<img class='img-circle img-batiment' src='public/images/" + batiment.imageName + "'>";
                html += "<img class='img-responsive  btn-infos' data-hydrated='false' src='public/images/info.png'>";
                html += "<img class='img-responsive btn-upgrade hidden' src='public/images/upgrade.png'> ";
                if (batiment.type == 'ressource') {
                    html += "<div class='img-circle slot-employes' >";
                    html += "<p>" + element.employes + "</p>";
                    html += "<div class='arrows-employes'>";
                    html += "<img class='arrow-up arrow-employes img-circle' src='public/images/arrow-up.png'>";
                    if (element.employes == 0) {
                        html += "<img class='arrow-down arrow-employes img-circle hidden' src='public/images/arrow-down.png'>";
                    } else {
                        html += "<img class='arrow-down arrow-employes img-circle' src='public/images/arrow-down.png'>";
                    }
                    html += "</div></div>";
                }
                html += "</div>";
                // console.log(html);
                $('#' + rowToAppend).append(html);

                //Recuperation de la capacite max de chaque ressource
                if (batiment.type == "batiment") {
                    createCookie('capacite-ressource-' + batiment.idRessource, batiment.value, 1);
                } else {
                    createCookie('production-ressource-' + batiment.idRessource, batiment.value, 1);
                    var prod = parseInt($('#ressource-' + batiment.idRessource).find('.production').text());
                    prod = prod * parseInt(element.employes);
                    $('#ressource-' + batiment.idRessource).find('.production').text(prod);
                }
            });
        });

        fn();
    }

    function updateStock(divRessource) {

        $(".ressource-informations").each(function (index, element) {
            var stock = parseFloat($(element).find('.actual').attr('data-actual'));
            var max = parseInt($(element).find('.max').text());
            var production = parseInt($(element).find('.production').text());
            var ressourcesProduites = production * refreshPeriode / 3600000;
            stock += parseFloat(ressourcesProduites);
            if (stock >= max) {
                stock = max;
                $(element).find('.actual').css('color', 'red');
            } else {
                $(element).find('.actual').css('color', 'black');
            }
            $(element).find('.actual').attr('data-actual', stock);
            $(element).find('.actual').text(parseInt(stock));
        });

        //Mise à jour de la pop
        var pop = parseFloat($('.totalPop').attr('data-totalPop'));
        var max = parseInt($('.maxPop').text());
        var evolution = parseInt($('.evolutionPop').text());
        var popProduite = evolution * refreshPeriode / 3600000;
        pop += parseFloat(popProduite);
        if (pop >= max) {
            pop = max;
            $('.totalPop').css('color', 'red');
        } else {
            $('.totalPop').css('color', 'black');
        }
        $('.totalPop').attr('data-totalPop', pop);
        $('.totalPop').text(parseInt(pop));
    }

    function updateInfos() {
        $(".btn-infos").each(function (index, element) {
            if ($(this).attr('data-hydrated') == 'false') {
                // console.log('debut update infos');
                // console.log(1);
                var idBatiment = $(element).parent().attr('id');
                idBatiment = parseInt(idBatiment.substring(9, idBatiment.length));
                var prodActuelle = parseInt($(element).parent().attr('data-value'));
                // console.log(idBatiment);
                $.get("/getNextBatiment/" + idBatiment, function (batiment) {
                        var valueword = 'Stockage';
                        var actuelWord = ' actuel';
                        var timeWord = '';
                        if (batiment.type == 'ressource') {
                            valueword = 'Production';
                            actuelWord = ' actuelle';
                            timeWord = '/h';
                        }
                        if (batiment.type == 'habitation') {
                            valueword = 'Population';
                            actuelWord = ' actuelle';
                            timeWord = '';
                        }
                        var html = "<div class='img-circle description hidden'>";
                        html += "<h3 class='titre-description'>Niveau " + (batiment.lvl - 1) + "</h3>";
                        html += "<p>" + valueword + actuelWord + " : " + prodActuelle + timeWord + "</p>";
                        html += "<p>" + valueword + " prochain lvl: " + batiment.value + timeWord + "<br/>";
                        html += "Cout pour passer au prochain lvl: <span class='costNextLvl'>" + batiment.prix + "</span> or ";
                        html += "</p>";
                        // console.log(element);
                        $(element).parent().append(html);
                        $(element).attr('data-hydrated', 'true');
                    }
                );
            }
        });
        updateBtnUpgrade();
    }

    function updateBtnUpgrade() {
        // console.log('update btn upgrade');
        var stockOr = parseInt($('#ressource-1').find('.actual').attr('data-actual'));
        // console.log('stockOr' + stockOr);
        $(".btn-upgrade").each(function (index, element) {
            var cost = parseInt($(element).parent().find('.costNextLvl').text());
            // console.log('cost: ' + cost);
            if (stockOr >= cost) {
                $(element).removeClass("hidden");
            }
        });
    }

    function timerUpdate(fn) {
        var refreshId = setInterval(function () {
            if ($(".disponiblePop").text() == 0) {
                $(".arrow-up").each(function (index, element) {
                    $(element).addClass("hidden");
                });
            }
            updateStock();
            updateInfos();
        }, refreshPeriode);
    }

    function resetPage() {

        $('#row-informations').remove();
        $('#row-habitations').remove();
        $('#row-batiments').remove();
        $('#row-ressources').remove();

        var html = "<div class='row' id='row-informations'>";
        html += "<div class='col-xs-12'>";
        html += "<nav class='navbar navbar-default'>";
        html += "<ul class='nav navbar-nav'>";
        html += "<li><a>POPULATION</a></li>";
        html += "<li><a>Totale: <span data-totalpop='' class='totalPop'></span></a></li>";
        html += "<li><a>Disponible: <span data-disponiblePop='' class='disponiblePop'></span></a></li>";
        html += "<li><a>Maximum: <span class='maxPop'></span></a></li>";
        html += "<li><a>Evolution: <span class='evolutionPop'></span></a></li>";
        html += "</ul>";
        html += "</nav>";
        html += "</div>";
        html += "</div>";


        html += "<div class='row' id='row-habitations'>";
        html += "</div>";
        html += "<div class='row' id='row-batiments'>";
        html += "</div>";
        html += "<div class='row' id='row-ressources'>";
        html += "</div>";

        $("nav").after(html);
    }

    function num(number) {
        var numberFormated = '';
        number = parseInt(number);
        if (number < 1000) {
            numberFormated = number;
        } else if (number >= 1000 && number < 1000000) {
            numberFormated = number / 1000 + 'k';
        } else {
            numberFormated = number / 1000000 + 'M';
        }
        console.log(numberFormated);
        return numberFormated;
    }

})
