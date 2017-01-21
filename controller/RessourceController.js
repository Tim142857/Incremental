var RessourceController = {

    getRessource: function getRessource(req, res, callback) {
        var idRessource = req.params.idRessource;
        Crud.findOneById(Ressource, idRessource, function (object) {
            callback(object);
        });
    }
}