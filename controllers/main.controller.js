exports.MainController = function(app, dbcon) {
    
    const StateModel = require('../models/mysql/state.model.js').StateModel(dbcon);
    const LanguageModel = require('../models/mysql/language.model.js').LanguageModel(dbcon); 
    const PopulatedPlace = require('../models/mysql/populatedPlace.model.js').PopulatedPlaceModel(dbcon);
    const HomeModel = require('../models/mysql/main.model.js').HomeModel(dbcon)
 
    app.get('/', (req, res) => {
        HomeModel.displayAll()
        .then(data => {
            res.render('home', {     //after successfully excuting the query, render the 'message.ejs' view in order to display the message
                mysqlDatas : data
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : ''
            }); 
        })
    });


}