var CustomRepository = {
    updateStock: function updateStock(idVillage, callback) {
        var query = "select r.id ,r.idVillage, r.idRessource, r.stock, r.lastUpdate, b.value, b.type, s.employes from reserve r, batiment b, slot s where r.idRessource=b.idRessource and r.idVillage=" + idVillage + " and s.idBatiment=b.id";
        // console.log(query);
        connectionSQL.query(
            query,
            function updateStock(error, results, fields) {
                if (error) {
                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log(myName + '/ERROR: Error while performing Query : ' + error);
                    console.log(query);
                    console.log('-------------------------------');
                }
                else {
                    // console.log('results');
                    // console.log(results);
                    Object.keys(results).forEach(function (element, index) {
                        if (results[element].type != 'batiment') {

                            // console.log(toTimestamp(new Date()));
                            // console.log(toTimestamp(results[element].lastUpdate));
                            var tmpEcoule = toTimestamp(new Date()) - toTimestamp(results[element].lastUpdate);
                            var ressourcesProduites = Math.round(results[element].employes * results[element].value * tmpEcoule / 3600);
                            var newStock = results[element].stock + ressourcesProduites;
                            var maxStock = results[element - 1].value;
                            if (newStock > maxStock) {
                                newStock = maxStock;
                            }
                            // console.log(ressourcesProduites);
                            var r = Object.create(Reserve);
                            r.id = results[element].id;
                            r.idVillage = results[element].idVillage;
                            r.idRessource = results[element].idRessource;
                            r.stock = newStock;
                            r.lastUpdate = getDateTime();
                            // console.log(r.lastUpdate);
                            // console.log(1);
                            Crud.update(r, function () {
                                // console.log(2);
                            });
                        }
                    });
                    // for (var key in results) {
                    //     if (results[key].type != 'batiment') {
                    //
                    //         console.log(toTimestamp(new Date()));
                    //         console.log(toTimestamp(results[key].lastUpdate));
                    //         var tmpEcoule = toTimestamp(new Date()) - toTimestamp(results[key].lastUpdate);
                    //         var ressourcesProduites = Math.round(results[key].employes * results[key].value * tmpEcoule / 3600);
                    //         var newStock = results[key].stock + ressourcesProduites;
                    //         var maxStock = results[key - 1].value;
                    //         if (newStock > maxStock) {
                    //             newStock = maxStock;
                    //         }
                    //         console.log(ressourcesProduites);
                    //         var r = Object.create(Reserve);
                    //         r.id = results[key].id;
                    //         r.idVillage = results[key].idVillage;
                    //         r.idRessource = results[key].idRessource;
                    //         r.stock = newStock;
                    //         // console.log(r);
                    //         Crud.update(r, function () {
                    //         });
                    //     }
                    // }

                    console.log('stock a jour');
                    callback();

                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    // console.log('INFO:' + myName + ' ok');
                }
            })
    },

    getBatimentOnSlot: function getBatimentOnSlot(idSlot, fn) {
        Crud.findOneById(Slot, idSlot, function (slot) {
            Crud.findOneById(Batiment, slot.idBatiment, function (batiment) {
                fn(batiment);
            });
        });
    },

    getNextBatiment: function getNextBatiment(batiment, fn) {
        var type = batiment.type;
        var idRessource = batiment.idRessource;
        var lvl = batiment.lvl + 1;
        var arr = {type: type, idRessource: idRessource, lvl: lvl};
        Crud.findBy(Batiment, arr, function (array) {
            var nextBatiment = array[0];
            fn(nextBatiment);
        });
    }
}

function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}