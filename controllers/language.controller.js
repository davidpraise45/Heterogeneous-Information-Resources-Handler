exports.LanguageController = function(app, dbcon, neo4j) {

    const LanguageModel = require('../models/mysql/language.model.js').LanguageModel(dbcon);
    const Neo4jLanguageModel = require('../models/neo4j/language.model.js').LanguageModel(neo4j); 

    app.get('/getAllLanguages', (req, res) => {
        LanguageModel.getAllLanguages()
        .then(data => {
            res.render('languages/languages', {   
                languages : data
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : ''
            }); 
        })
    });

    app.get('/addLanguage', (req, res) => {
        LanguageModel.getAllLanguages()   //Call model function that return all states from the database
        .then((data) => {
            res.render('languages/addLanguage', {
                languages : data,
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err + '!',
                link : 'ERROR: ' + err + ' <a href="/addLanguage">Goback!</a>'
            });
        })
    });

    app.post('/addLanguage', (req, res) => {

        let getAllLanguages = LanguageModel.getAllLanguages();
        let mysqlAddLanguage = LanguageModel.addLanguage(req.body.languageId, req.body.languageName);
        let neo4jAddPromise = Neo4jLanguageModel.addLanguage(req.body.languageId, req.body.languageName);

        Promise.all([getAllLanguages, mysqlAddLanguage, neo4jAddPromise])
        .then((data) => {
            for (let language of data[0]) {  
                if (language.JEZ_JEZIK == req.body.languageId || language.JEZ_NAZIV == req.body.languageName) {
                    return res.render('message', {
                        errorMessage : 'Language ' + req.body.languageName + ' or ID ' + req.body.languageId + ', already exists, try again!',
                        link : '<a href="/addLanguage"> Go Back</a>' 
                    });
                }
            }
            res.redirect('/addLanguage')
        })
        .catch((err) => {
            res.render('message', {  
                errorMessage : 'ERROR: Language Id: '+req.body.languageId+' Already Exists in the database. ',
                link : '<a href="/addLanguage"> Go Back</a>'
            });
        });
    });

    app.get('/editLanguageById/:id', (req, res) => {
        LanguageModel.getLanguageById(req.params.id)
        .then(data => {
            console.log(data[0]);
            res.render('languages/editLanguage', {
                languages : data[0] 
            });
        })
        .catch((err) => {      
            res.render('message', {
                errorMessage : 'ERROR:' + err + '!',
                link : '<a href="/getAllLanguages"> Go Back</a>'
            });
        });
    });

    app.post('/editLanguageById/:id', (req, res) => {
        let mysqlEditPromise = LanguageModel.editLanguageById(req.body.languageId,req.body.languageName, req.params.id);
        let neo4jEditPromise = Neo4jLanguageModel.editLanguageById(req.body.languageId, req.body.languageName,req.params.id);
        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllLanguages');
        })
        .catch((err) => {
            console.log(req.params.id);
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editLanguageById/' + req.params.id + '"> Go Back</a>'
            });
        });
    });

    app.get('/deleteLanguageById/:id', (req, res) => {
        let mysqlEditPromise = LanguageModel.deleteLanguageById(req.params.id);
        let neo4jEditPromise = Neo4jLanguageModel.deleteLanguageById(req.params.id);
        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllLanguages')
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllLanguages/' + req.params.id + '"> Go Back</a>'
            });
        })
    });
}