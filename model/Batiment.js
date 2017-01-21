var Batiment = {

    //attributs
    id: null,
    lvl: null,
    name: null,
    value: null,
    prix: null,
    type: null,
    imageName: null,
    idRessource: null,

    //Contructeur
    Batiment: function construct(lvl, name, value) {
        this.lvl = lvl;
        this.name = name;
        this.value = value;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'batiment';
    }

}