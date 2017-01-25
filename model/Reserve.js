var Reserve = {

    //attributs
    id: null,
    idVillage: null,
    idRessource: null,
    stock: null,
    lastUpdate: null,

    //Contructeur
    Reserve: function construct(idVillage, idRessource, stock) {
        this.idVillage = idVillage;
        this.idRessource = idRessource;
        this.stock = stock;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'reserve';
    }

}