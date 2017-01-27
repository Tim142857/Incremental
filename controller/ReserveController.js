var ReserveController = {

    updateStock: function updateStock(idVillage, fn) {
        CustomRepository.updateStock(idVillage, fn);
    },

    getOrStock: function getOrStock(idVillage, fn) {
        Crud.findBy(Reserve, {idVillage: idVillage, idRessource: 1}, fn);
    }

}