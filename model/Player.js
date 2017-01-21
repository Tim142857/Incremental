var Player = {

    //attributs
    id: null,
    name: null,
    password: null,

    //Contructeur
    Player: function construct(name) {
        this.name = name;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'player';
    }

}

