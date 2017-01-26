var BatimentController = {

    getBatiment: function getBatiment(req, res, callback) {
        var idBatiment = req.params.idBatiment;
        Crud.findOneById(Batiment, idBatiment, function (object) {
            callback(object);
        });
    },

    getNextBatiment: function getNextBatiment(idBatiment, callback) {
        Crud.findOneById(Batiment, idBatiment, function (batiment) {
            CustomRepository.getNextBatiment(batiment, function (nextBatiment) {
                // console.log(nextBatiment);
                callback(nextBatiment);
            });
        });
    }
}