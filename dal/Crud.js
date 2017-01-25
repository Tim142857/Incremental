var Crud = {

    //----------------------------------FONCTION INSERT-----------------------------------------------------------------
    insert: function (object) {
        var className = null;
        var listProperties = '';
        var listValues = '';
        var getClass = false;

        for (var key in object) {
            if (typeof(object[key]) == "function" && getClass == false) { //Premiere fonction=construct, la fonction porte le nom de la classe
                className = key;
                getClass = true;
            }
            //Pour chaque clé qui n'est pas une fonction(==attribut), j'enregistre la clé et la valeur
            if (typeof(object[key]) != "function" && key != 'id') {
                if (key != 'lastUpdate') {
                    listProperties += key + ", ";
                    listValues += "'" + object[key] + "', ";
                }
            }
        }

        //Je supprimer le dernier " ', "
        listProperties = listProperties.substring(0, listProperties.length - 2);
        listValues = listValues.substring(0, listValues.length - 2);


        if (getClass == false || className == null || className == '') {
            console.log("WARNING: le nom de classe n'a pas pu être récupéré");
        } else {
            var selectQuery = "INSERT INTO " + className + " (" + listProperties + ") VALUES(" + listValues + ")";
            console.log(selectQuery);
            connectionSQL.query(
                selectQuery,
                function insert(error, results, fields) {
                    if (error)
                        console.log('ERROR: Error while performing Query : ' + error);
                    else {
                        var myName = arguments.callee.toString();
                        myName = myName.substr('function '.length);
                        myName = myName.substr(0, myName.indexOf('('));
                        console.log('INFO:' + myName + ' ok');
                    }
                })
        }
    },


    //----------------------------------FONCTION FINDBYID-----------------------------------------------------------------
    findOneById: function (ObjectType, id, fn) {
        var selectQuery = "SELECT * FROM " + ObjectType.getClassName() + " WHERE id=" + id;
        // console.log(selectQuery);
        connectionSQL.query(
            selectQuery,
            function findOneById(error, results, fields) {
                if (error)
                    console.log('Error while performing Query : ' + error);
                else {

                    if (results.length > 0) {
                        var myObject = Object.create(ObjectType);
                        for (var key in results[0]) {
                            myObject[key] = results[0][key];
                        }
                    } else {
                        var myObject = null;
                    }


                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log('INFO:' + myName + ' ok');
                    fn(myObject);
                }
            });
    },

    //----------------------------------FONCTION FINDALL-----------------------------------------------------------------
    findAll: function (ObjectType, fn) {
        var selectQuery = "SELECT * FROM " + ObjectType.getClassName();

        connectionSQL.query(
            selectQuery,
            function findAll(error, results, fields) {
                if (error)
                    console.log('Error while performing Query : ' + error);
                else {

                    //Je créé mon tableau qui va contenir tous mes objects
                    var arrayObjects = [];
                    //Je parse chaque ligne de mes resultats en 1 object
                    for (var i = 0; i < results.length; i++) {
                        //J'instancie mon object
                        var myObject = Object.create(ObjectType);
                        //J'hydrate mon object
                        for (var key in results[i]) {
                            myObject[key] = results[i][key];
                        }
                        //Et je l'ajoute au tableau
                        arrayObjects.push(myObject);
                    }

                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log('INFO:' + myName + ' ok');
                    fn(arrayObjects);
                }
            });
    },

    //----------------------------------FONCTION FINDBY-----------------------------------------------------------------

    /*
     exemple d'utilisation:
     var test = Object.create(TestDAO);
     test.findBy(param1, param2, function(urResultArray){
     use your resultArray here;
     });
     */
    findBy: function (ObjectType, array, fn) {
        //Construction de la partie where
        var whereQuery = ' WHERE ';
        for (var key in array) {
            //Si attribut peut valoir plusieurs valeurs
            if (typeof(array[key]) == "object") {
                whereQuery += ' (';
                for (var key2 in array[key]) {
                    whereQuery += key + "='" + array[key][key2] + "' OR ";
                }
                whereQuery = whereQuery.substring(0, whereQuery.length - 4);
                whereQuery += ')';
            } else {
                whereQuery += key + "='" + array[key] + "'";
            }

            whereQuery += ' and ';
        }
        whereQuery = whereQuery.substring(0, whereQuery.length - 4);

        var arrayObjects = [];

        var selectQuery = "SELECT * FROM " + ObjectType.getClassName() + whereQuery;
        // console.log(selectQuery);
        connectionSQL.query(
            selectQuery,
            function findBy(error, results, fields) {
                if (error) {
                    console.log('Error while performing Query : ' + error);
                }
                else {
                    //Je parse chaque ligne de mes resultats en 1 object
                    for (var i = 0; i < results.length; i++) {
                        //J'instancie mon object
                        var myObject = Object.create(ObjectType);
                        //J'hydrate mon object
                        for (var key in results[i]) {
                            myObject[key] = results[i][key];
                        }
                        //Et je l'ajoute au tableau
                        arrayObjects.push(myObject);
                    }

                    // var myName = arguments.callee.toString();
                    // myName = myName.substr('function '.length);
                    // myName = myName.substr(0, myName.indexOf('('));
                    // console.log('INFO:' + myName + ' ok');
                }
                fn(arrayObjects);
            });
    },

    //----------------------------------FONCTION DELETE-----------------------------------------------------------------
    delete: function (object) {
        var selectQuery = "DELETE FROM " + object.getClassName() + " WHERE id=" + object.id;
        // console.log(selectQuery);
        connectionSQL.query(
            selectQuery,
            function suppress(error, results, fields) {
                if (error)
                    console.log('Error while performing Query : ' + error);
                else {
                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log('INFO:' + myName + ' ok');
                }
            });
    },

    //----------------------------------FONCTION UPDATE-----------------------------------------------------------------
    update: function (object, fn) {
        var setquery = ' SET ';

        for (var key in object) {
            // console.log(key);
            // console.log(typeof(object[key]));
            if (typeof(object[key]) != "function" && key != 'id') {
                if (key != 'lastUpdate') {
                    // console.log('je passe');
                    setquery += key + "='" + object[key] + "', ";
                }
            }
        }
        setquery = setquery.substring(0, setquery.length - 2);
        setquery += ' WHERE id=' + object.id;

        var selectQuery = "UPDATE " + object.getClassName() + setquery;
        // console.log(selectQuery);
        connectionSQL.query(
            selectQuery,
            function update(error, results, fields) {
                if (error)
                    console.log('Error while performing Query : ' + error);
                else {
                    var myName = arguments.callee.toString();
                    myName = myName.substr('function '.length);
                    myName = myName.substr(0, myName.indexOf('('));
                    console.log('INFO:' + myName + ' ok');
                }
            });
        if (typeof(fn) != 'undefined' && typeof(fn) == 'function') {
            fn(object);
        }
    },


}

