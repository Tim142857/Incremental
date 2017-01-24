var BatimentController = {

    getBatiment: function getBatiment(req, res, callback) {
        var idBatiment = req.params.idBatiment;
        Crud.findOneById(Batiment, idBatiment, function (object) {
            callback(object);
        });
    },

    getNextBatiment: function getNextBatiment(req, res, callback) {
        var idBatiment = parseInt(req.params.idBatiment) + 1;
        Crud.findOneById(Batiment, idBatiment, function (object) {
            callback(object);
        });
    }
}