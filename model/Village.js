var Village = {

    //attributs
    id: null,
    idPlayer: null,

    //Contructeur
    Village: function construct(idPlayer) {
        this.idPlayer = idPlayer;
    },

    //fonctions
    getClassName: function getClassName() {
        return 'village';
    }

}