app.get('/accueil', function (req, res) {
    if (('idPlayer' in req.cookies) == false || req.cookies['idPlayer'] == 'null') {
        res.redirect('/');
    } else {
        test(function () {
            io.sockets.emit('toto');
        });

        function test(fn) {
            res.sendfile(__dirname + '/views/index.html');
            fn();
        }
    }
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/login.html');
});

app.get('/test', function (req, res) {
    CustomRepository.updateStock(1);
});


//-------------------------------------------    USER    ---------------------------------------------------------------
app.get('/login', function (req, res) {
    UserController.login(req, res);
});

app.get('/logout', function (req, res) {
    UserController.logout(req, res);
});

app.get('/register', function (req, res) {
    UserController.register(req, res);
});

//--------------------------------------------   AJAX    ---------------------------------------------------------------
app.get("/getBatiment/:idBatiment", function (req, res) {
    BatimentController.getBatiment(req, res, function (object) {
        res.send(object);
        res.end();
    });
});

app.get("/getNextBatiment/:idBatiment", function (req, res) {
    var idBatiment = parseInt(req.params.idBatiment);
    BatimentController.getNextBatiment(idBatiment, function (object) {
        res.send(object);
        res.end();
    });
});

app.get("/getRessource/:idRessource", function (req, res) {
    RessourceController.getRessource(req, res, function (object) {
        res.send(object);
        res.end();
    });
});

app.get("/updateEmployes/:sens/:idSlot/:idPop", function (req, res) {
    SlotController.updateEmployes(req, res, function (object) {
        res.send(object);
        res.end();
    });
});

app.get("/upgradeBatiment/:idSlot", function (req, res) {
    SlotController.ugradeBatiment(req, res, function (message) {
        // console.log(message);
        res.send(message);
        res.end();
    });
});


//-----------------------------------  RESSOURCES STATIQUES  -------------------------------------------------------
//Chargement css
app.get('/public/style/:ressource', function (req, res) {
    var ressource = req.params.ressource;
    res.sendfile(__dirname + '/views/public/style/' + ressource);
});

//Chargement js
app.get('/public/js/:ressource', function (req, res) {
    var ressource = req.params.ressource;
    res.sendfile(__dirname + '/views/public/js/' + ressource);
});

//Chargement images
app.get('/public/images/:ressource', function (req, res) {
    var ressource = req.params.ressource;
    res.sendfile(__dirname + '/views/public/images/' + ressource);
});


