var BatimentController = {

    getBatiment: function getBatiment(req, res, callback) {
        var idBatiment = req.params.idBatiment;
        Crud.findOneById(Batiment, idBatiment, function (object) {
            callback(object);
        });
    }
}