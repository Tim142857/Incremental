var UserController = {

    login: function login(req, res) {

        var pseudo = req.param('pseudo');
        var password = req.param('password');
        var routeToRedirect = null;
        var eventToEmit = null;

        Crud.findBy(Player, {name: pseudo, password: password}, function (array) {
            if (array.length == 0) {
                res.redirect('/');
            } else {
                var options = {
                    httpOnly: false, // The cookie only accessible by the web server
                    signed: false // Indicates if the cookie should be signed
                }
                // Set cookie
                res.cookie('idPlayer', array[0].id, options) // options is optional

                res.redirect('/accueil');
            }
        });
    },

    loadUser: function loadUser(idPlayer, callback) {
        var array = [];
        //chargement user
        // console.log(idPlayer);
        Crud.findOneById(Player, idPlayer, function (player) {
            array.push(player);
            //chargement village
            Crud.findOneById(Village, player.id, function (village) {
                var idVillage = village.id;
                ReserveController.updateStock(idVillage, function () {
                    array.push(village);
                    Crud.findOneById(Population, idVillage, function (population) {
                        array.push(population);
                        Crud.findBy(Slot, {idVillage: idVillage}, function (slots) {
                            array.push(slots);
                            Crud.findBy(Reserve, {idVillage: idVillage}, function (reserves) {
                                array.push(reserves);
                                callback(array);
                            });
                        });
                    });
                })
            });
        });
    },

    logout: function logout(req, res) {
        if ('idPlayer' in req.cookies) {
            var options = {
                httpOnly: false, // The cookie only accessible by the web server
                signed: false // Indicates if the cookie should be signed
            }
            // Set cookie
            res.cookie('idPlayer', 'null', options);
        }
        res.redirect('/');
    },

    register: function register(req, res) {

        var pseudo = req.param('pseudo');
        var password = req.param('password');

        var player = Object.create(Player);
        player.name = pseudo;
        player.password = password;

        Crud.insert(player, function (id) {
            var village = Object.create(Village);
            village.idPlayer = id;
            console.log(id);
            Crud.insert(village, function (idVillage) {

                Crud.findBy(Batiment, {type: 'habitation', lvl: 1}, function (array) {
                    var batiment = array[0];

                    var pop = Object.create(Population);
                    pop.idVillage = idVillage;
                    pop.actual = batiment.value;
                    pop.max = batiment.value;
                    pop.disponible = batiment.value - 2;
                    pop.evolution = 1;

                    pop.idVillage = idVillage;
                    Crud.insert(pop, function () {
                        var slotHabitation = Object.create(Slot);
                        slotHabitation.idVillage = idVillage;
                        slotHabitation.idBatiment = idHabitation1;
                        slotHabitation.employes = null;

                        Crud.insert(slotHabitation, function () {
                            var slotOr = Object.create(Slot);
                            slotOr.idVillage = idVillage;
                            slotOr.idBatiment = idOr1;
                            slotOr.employes = 1;

                            Crud.insert(slotOr, function () {
                                var slotStockOr = Object.create(Slot);
                                slotStockOr.idVillage = idVillage;
                                slotStockOr.idBatiment = idStockOr1;
                                slotStockOr.employes = 0;

                                Crud.insert(slotStockOr, function () {
                                    var slotNourriture = Object.create(Slot);
                                    slotNourriture.idVillage = idVillage;
                                    slotNourriture.idBatiment = idNourriture1;
                                    slotNourriture.employes = 1;

                                    Crud.insert(slotNourriture, function () {
                                        var slotStockNourriture = Object.create(Slot);
                                        slotStockNourriture.idVillage = idVillage;
                                        slotStockNourriture.idBatiment = idStockNourriture1;
                                        slotStockNourriture.employes = 0;
                                        Crud.insert(slotStockNourriture, function () {
                                            var reserveOr = Object.create(Reserve);
                                            reserveOr.idVillage = idVillage;
                                            console.log(idRessourceOr);
                                            reserveOr.idRessource = idRessourceOr;
                                            console.log(reserveOr.idRessource);
                                            reserveOr.stock = 15;

                                            Crud.insert(reserveOr, function () {
                                                var reserveNourriture = Object.create(Reserve);
                                                reserveNourriture.idVillage = idVillage;
                                                console.log(idRessourceNourriture);
                                                reserveNourriture.idRessource = idRessourceNourriture;
                                                reserveNourriture.stock = 15;

                                                Crud.insert(reserveNourriture, function () {
                                                    UserController.login(req, res);
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

}