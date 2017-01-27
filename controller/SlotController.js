var SlotController = {

    updateEmployes: function updateEmployes(req, res, callback) {
        // console.log(1);
        var idSlot = req.params.idSlot;
        var sens = parseInt(req.params.sens);
        var idPop = req.params.idPop;
        Crud.findOneById(Population, idPop, function (pop) {
            //Mise a jour du stock
            ReserveController.updateStock(pop.idVillage, function (reserve) {
                // console.log('resultat!');
                // console.log(reserve);
            });

            // console.log(2);
            var possible = true;
            if (sens == 1 && pop.disponible == 0) {
                possible = false;
            }
            Crud.findOneById(Slot, idSlot, function (slot) {
                // console.log(3);
                // console.log(slot);
                if (sens == -1 && slot.employes == 0) {
                    possible = false;
                }
                // console.log('possible: ' + possible);
                if (possible) {
                    // console.log(sens);
                    // console.log(typeof(sens));
                    if (sens == 1) {
                        // console.log('if');
                        slot.employes += 1;
                        pop.disponible -= 1;
                    } else {
                        // console.log('else');
                        slot.employes -= 1;
                        pop.disponible += 1;
                    }
                    // console.log(slot);
                    Crud.update(slot, function (slot) {
                        Crud.update(pop, function (pop) {
                            // console.log(4);
                            var array = ['success', slot, pop];
                            callback(array);
                        });
                    });
                } else {
                    // console.log('impossible)');
                    var array = ['error'];
                    callback(array);
                }
            });

        });
    },

    ugradeBatiment: function ugradeBatiment(req, res, callback) {
        var idSlot = req.params.idSlot;
        Crud.findOneById(Slot, idSlot, function (slot) {
            SlotController.getBatimentOnSlot(idSlot, function (batiment) {
                BatimentController.getNextBatiment(batiment.id, function (nextBatiment) {
                    // console.log(nextBatiment);
                    var prix = nextBatiment.prix;
                    ReserveController.updateStock(slot.idVillage, function () {
                        ReserveController.getOrStock(slot.idVillage, function (arrayReserves) {
                            var stockOr = arrayReserves[0].stock;
                            if (stockOr >= prix) {
                                slot.idBatiment = nextBatiment.id;
                                Crud.update(slot, function () {
                                    // console.log('update du slot...');
                                    arrayReserves[0].stock = stockOr - prix;
                                    arrayReserves[0].lastUpdate = getDateTime();
                                    // console.log(getDateTime());
                                    Crud.update(arrayReserves[0], function () {
                                        // console.log('update du stock or...');
                                        callback('tout est OK');
                                        if (batiment.type == 'habitation') {
                                            Crud.findBy(Population, {idVillage: slot.idVillage}, function (array) {
                                                var pop = array[0];
                                                var popSupp = nextBatiment.value - pop.max;
                                                pop.max = nextBatiment.value;
                                                pop.actual = pop.max;
                                                pop.disponible += popSupp;
                                                Crud.update(pop, function () {
                                                    console.log('pop à jour');
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    });
                });
            });
        })

        //Recuperer le slot
        //recuperer le batiment d'apres
        //Mettre a jour le stock
        //verifier si stock necessaire ok
        //upgrade slot
        //upgrade stock
        //renvoyer donnees au client

    },

    getBatimentOnSlot: function getBatimentOnSlot(idSlot, fn) {
        CustomRepository.getBatimentOnSlot(idSlot, function (batiment) {
            fn(batiment);
        });
    }
}