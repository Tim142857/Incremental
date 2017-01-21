var Population = {

    //attributs
    id: null,
    idVillage: null,
    max: null,
    actual: null,
    evolution: null,

    //Contructeur
    population: function construct(max, actual, evolution, idVillage) {
        this.max = max;
        this.actual = actual;
        this.evolution = evolution;
        this.idVillage = idVillage;
    },


    //fonctions
    getClassName: function getClassName() {
        return 'population';
    }


}
