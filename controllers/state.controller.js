exports.StateController = function(app, dbcon, mongo) {
    //console.log('Pravljenje kontrolera. Mongo je: ', mongo);

    const StateModel = require('../models/mysql/state.model.js').StateModel(dbcon);
    const PopulatedPlaceModel = require('../models/mysql/populatedPlace.model.js').PopulatedPlaceModel(dbcon);
    const LanguageModel = require('../models/mysql/language.model.js').LanguageModel(dbcon);
    const HighEducationInstituteModel = require('../models/mysql/highEducationInstitude.model.js').HighEducationInstitute(dbcon);

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
    
    app.get('/addState', (req, res) => {
        res.render('states/addState');
    });
    
    app.post('/addState', (req, res) => {
        StateModel.addState(req.body.stateId, req.body.stateName, req.body.stateFoundationDate)
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
        StateModel.editStateById(req.body.stateId, req.body.stateName, req.body.stateFoundationDate, req.params.id)
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
        HighEducationInstituteModel.deleteHighEducationInstituteByStateId(req.params.id)
        .catch((err) =>{
            res.send('Error deleting high education institute: '  + err);
        })
        .then(() => {
            PopulatedPlaceModel.deletePopulatedPlaceByStateId(req.params.id)
            .catch((err) => {
                res.send('Error deleting populated places: '  + err);
            })
            .then(() => {
                LanguageModel.deleteLanguageByStateId(req.params.id)
                .catch((err) => {
                    res.send('Error deleting language: '  + err);
                })
                .then(() => {
                    StateModel.deleteStateById(req.params.id)
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
}
