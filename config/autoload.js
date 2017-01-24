//------------------------------------  ROUTING -----------------------------------------------------------------------
eval(fs.readFileSync('../incremental/config/routing.js') + '');

//-------------------------------------- DAL ---------------------------------------------------------------------------
eval(fs.readFileSync('./dal/ConnexionBase.js') + '');
eval(fs.readFileSync('./dal/Crud.js') + '');


//------------------------------------  MODEL --------------------------------------------------------------------------
eval(fs.readFileSync('./model/Player.js') + '');
eval(fs.readFileSync('./model/Population.js') + '');
eval(fs.readFileSync('./model/Village.js') + '');
eval(fs.readFileSync('./model/Tools.js') + '');
eval(fs.readFileSync('./model/Batiment.js') + '');
eval(fs.readFileSync('./model/Slot.js') + '');
eval(fs.readFileSync('./model/Ressource.js') + '');
eval(fs.readFileSync('./model/Reserve.js') + '');


//-----------------------------------  CONTROLLER ----------------------------------------------------------------------
eval(fs.readFileSync('./controller/UserController.js') + '');
eval(fs.readFileSync('./controller/BatimentController.js') + '');
eval(fs.readFileSync('./controller/RessourceController.js') + '');
eval(fs.readFileSync('./controller/SlotController.js') + '');
eval(fs.readFileSync('./controller/PopulationController.js') + '');
