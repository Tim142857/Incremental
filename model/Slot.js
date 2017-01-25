var Slot = {

    //attributs
    id: null,
    idVillage: null,
    idBatiment: null,
    employes: null,

    //Contructeur
    Slot: function construct(idVillage, idBatiment) {
        this.idVillage = idVillage;
        this.idBatiment = idBatiment;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'slot';
    }

}