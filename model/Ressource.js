var Ressource = {

    //attributs
    id: null,
    name: null,

    //Contructeur
    Ressource: function construct(name) {
        this.name = name;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'ressource';
    }

}