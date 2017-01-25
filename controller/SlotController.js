var SlotController = {

    updateEmployes: function updateEmployes(req, res, callback) {
        console.log(1);
        var idSlot = req.params.idSlot;
        var sens = parseInt(req.params.sens);
        var idPop = req.params.idPop;
        Crud.findOneById(Population, idPop, function (pop) {
            console.log(2);
            var possible = true;
            if (sens == 1 && pop.disponible == 0) {
                possible = false;
            }
            Crud.findOneById(Slot, idSlot, function (slot) {
                console.log(3);
                console.log(slot);
                if (sens == -1 && slot.employes == 0) {
                    possible = false;
                }
                console.log('possible: ' + possible);
                if (possible) {
                    console.log(sens);
                    console.log(typeof(sens));
                    if (sens == 1) {
                        console.log('if');
                        slot.employes += 1;
                        pop.disponible -= 1;
                    } else {
                        console.log('else');
                        slot.employes -= 1;
                        pop.disponible += 1;
                    }
                    console.log(slot);
                    Crud.update(slot, function (slot) {
                        Crud.update(pop, function (pop) {
                            console.log(4);
                            var array = ['success', slot, pop];
                            callback(array);
                        });
                    });
                } else {
                    console.log('impossible)');
                    var array = ['error'];
                    callback(array);
                }
            });

        });
    }
}