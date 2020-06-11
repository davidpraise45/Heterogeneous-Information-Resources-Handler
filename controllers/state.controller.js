exports.StateController = function(app, dbcon, mongo, neo4j) {
    const StateModel = require('../models/mysql/state.model.js').StateModel(dbcon);
    const PopulatedPlaceModel = require('../models/mysql/populatedPlace.model.js').PopulatedPlaceModel(dbcon);
    const LanguageModel = require('../models/mysql/language.model.js').LanguageModel(dbcon);
    const HighEducationInstituteModel = require('../models/mysql/highEducationInstitude.model.js').HighEducationInstitute(dbcon);
    const Neo4jStateModel = require('../models/neo4j/state.model.js').StateModel(neo4j);
    const StateCollection = require('../models/mongodb/state.collection.js').StateCollectionModel(mongo);

    app.get('/getAllStates', (req, res) => {
        StateModel.getAllStates()
        .then((data) => {
            res.render('states/states', {  //render the states.ejs view
                states : data,   //send the retrieved data to the view as an object called 'states'
            });
        })
        .catch(err => {     //in case of error executing the query, render the 'states.ejs' view and display the obtained error message
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addState"> Go Back</a>'
            });  
        });
    });
    /*
    app.get('/getStateById', (req, res) => {
        StateModel.getStateById(req.params.id)
        .then((data) => {
            res.render('states/state', {
                state : data[0]
            });
        })
        .catch((err) => {
            res.send('editState', err);
        });
    });*/
    
    app.get('/addState', (req, res) => {
        res.render('states/addState');
    });
    
    app.post('/addState', (req, res) => {
        let mysqlAddPromise = StateModel.addState(req.body.stateId, req.body.stateName, req.body.stateFoundationDate);
        let neo4jAddPromise = Neo4jStateModel.addState(req.body.stateId, req.body.stateName, req.body.stateFoundationDate);
        Promise.all([mysqlAddPromise, neo4jAddPromise])
        .then((data) => {
            res.redirect('/addState');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addState"> Go Back</a>'
            });
        });
    });
    
    app.get('/editStateById/:id', (req, res) => {
        StateModel.getStateById(req.params.id)  //Retrieves state's data in order to show the intinal data of the requested state to be dited
        .then((data) => {
            res.render('states/editState', {
                state : data[0]
            });
        })
        .catch((err) => {
            res.send('editState', err);
        });
    });
    
    app.post('/editStateById/:id', (req, res) => {
        let mysqlEditPromise = StateModel.editStateById(req.body.stateId, req.body.stateName, req.body.stateFoundationDate, req.params.id);
        let neo4jEditPromise = Neo4jStateModel.editStateById(req.body.stateId, req.body.stateName, req.body.stateFoundationDate, req.params.id);

        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllStates');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editStateById/' + req.body.stateId + ' "> Go back!</a>'   //This link will redirect to the edit page of the state with the ID submitted in the form
            });
        });
    });
    
    app.get('/deleteStateById/:id', (req, res) => {
        
        let mysqlDeletePromise = StateModel.deleteStateById(req.params.id);
        let mysqlDeletePopulatedPlaces = PopulatedPlaceModel.deletePopulatedPlaceById(req.params.id);
        let mysqlDeleteLanguage = LanguageModel.deleteLanguageByStateId(req.params.id);
        let mysqlDeleteHighEducation = HighEducationInstituteModel.deleteHighEducationInstituteByStateId(req.params.id);
        let neo4jDeletePromise = Neo4jStateModel.deleteStateById(req.params.id);

        Promise.all([mysqlDeletePromise, neo4jDeletePromise, mysqlDeleteHighEducation, mysqlDeleteLanguage, mysqlDeletePopulatedPlaces])
        .catch((err) =>{
            res.send('Error deleting state '  + err);
        })
        .then(() => {
            mysqlDeletePopulatedPlaces.deletePopulatedPlaceByStateId(req.params.id)
            .catch((err) => {
                res.send('Error deleting populated places: '  + err);
            })
            .then(() => {
                mysqlDeleteLanguage.deleteLanguageByStateId(req.params.id)
                .catch((err) => {
                    res.send('Error deleting language: '  + err);
                })
                .then(() => {
                    mysqlDeleteHighEducation.deleteHighEducationInstituteByStateId(req.params.id)
                    .catch((err) => {
                        res.send('Error deleting High school education: '+err);
                    })
                    .then(() =>{
                        mysqlDeletePromise.deleteStateById(req.params.id)
                        .then(() => {
                            res.redirect('/getAllStates');
                        })
                        .catch((err) => {
                            res.send('Error deleteing state: '  + err);
                        });
                    });
                });
            });
        });
    });

    // This is for generating the state documents
    app.get('/getStateDocument', (req, res) => {
        StateCollection.getAllDocuments()
        .then((data) => {
            res.render('documentView/stateDocument', {
                documents : data
            });
        })
        .catch((err) => {

        });
    });

    app.get('/generateStateDocument', (req, res) => {
        const allStates = StateModel.getAllStates(); 

        Promise.all([allStates])
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getStateDocument"> Go Back</a>'
            });
        })
        .then(([allStates]) => {
            return new Promise((resolve, reject) => {

                allStates = allStates.map(state => {
                    return {
                        stateId : state.DR_IDENTIFIKATOR,
                        stateName : state.DR_NAZIV,
                        stateFoundationDate : state.DR_DATUM_OSNIVANJA
                    }
                });

                if(allStates.length == 0) {
                    reject('No State Document!');
                }

                resolve({
                    created_at : JSON.stringify(new Date()),
                    allStates : allStates
                });
            });
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/"> Go Back</a>'
            });
        })
        .then((stateDocument) => {
            StateCollection.insertDocuments(stateDocument)
            .then(() => {
                res.redirect('/getStateDocument');
            });
        })
    });
}
