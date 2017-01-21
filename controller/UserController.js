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
        console.log(idPlayer);
        Crud.findOneById(Player, idPlayer, function (player) {
            array.push(player);
            //chargement village
            Crud.findOneById(Village, player.id, function (village) {
                array.push(village);
                Crud.findOneById(Population, village.id, function (population) {
                    array.push(population);
                    Crud.findBy(Slot, {idVillage: village.id}, function (slots) {
                        array.push(slots);
                        Crud.findBy(Reserve, {idVillage: village.id}, function (reserves) {
                            array.push(reserves);
                            callback(array);
                        });
                    });
                });
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
    }


}