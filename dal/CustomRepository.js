var CustomRepository = {
    updateStock: function updateStock(idVillage, callback) {
        var query = "select r.id ,r.idVillage, r.idRessource, r.stock, r.lastUpdate, b.value, b.type, s.employes from reserve r, batiment b, slot s where r.idRessource=b.idRessource and r.idVillage=" + idVillage + " and s.idBatiment=b.id";

        connectionSQL.query(
            query,
            function updateStock(error, results, fields) {
                if (error)
                    console.log('ERROR: Error while performing Query : ' + error);
                else {
                    // console.log('results');
                    // console.log(results);
                    for (var key in results) {
                        if (results[key].type != 'batiment') {

                            console.log(toTimestamp(new Date()));
                            console.log(toTimestamp(results[key].lastUpdate));
                            var tmpEcoule = toTimestamp(new Date()) - toTimestamp(results[key].lastUpdate);
                            var ressourcesProduites = Math.round(results[key].employes * results[key].value * tmpEcoule / 3600);
                            var newStock = results[key].stock + ressourcesProduites;
                            var maxStock = results[key - 1].value;
                            if (newStock > maxStock) {
                                newStock = maxStock;
                            }
                            console.log(ressourcesProduites);
                            var r = Object.create(Reserve);
                            r.id = results[key].id;
                            r.idVillage = results[key].idVillage;
                            r.idRessource = results[key].idRessource;
                            r.stock = newStock;
                            console.log(r);
                            Crud.update(r, function () {
                            });
                            callback(r);
                        }
                    }

                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log('INFO:' + myName + ' ok');
                }
            })
    }
}

function toTimestamp(strDate) {
    var datum = Date.parse(strDate);
    return datum / 1000;
}