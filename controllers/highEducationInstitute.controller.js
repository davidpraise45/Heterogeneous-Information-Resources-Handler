exports.HighEducationInstituteController = function(app, dbcon, neo4j) {
    const HighEducationInstitute = require('../models/mysql/highEducationInstitude.model').HighEducationInstitute(dbcon); 
    const Neo4jHighEducationInstituteModel = require('../models/neo4j/highEducationInstitute.model.js').HighEducationInstituteModel(neo4j);


    app.get('/getAllHighEducationInstitute', (req, res) => {
        HighEducationInstitute.getAllHighEducationInstitute()
        .then(data => {
            res.render('highEducationInstitute/highEducationInstitute', {     
                heis : data
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : ''
            }); 
        })
    });

    app.get('/addHighEducationInstitute', (req, res) => {
        HighEducationInstitute.getAllHighEducationInstitute()   
        .then((data) => {
            res.render('highEducationInstitute/addHighEducationInstitute', {
                heis : data,
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err + '!',
                link : 'ERROR'
            });
        })
    });

    app.post('/addHighEducationInstitute', (req, res) => {

        let mysqlAddPromise = HighEducationInstitute.addHighEducationInstitute(req.body.heiId, req.body.heiType, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId);
        let neo4jAddPromise = Neo4jHighEducationInstituteModel.addHighEducationInstitute(req.body.heiId, req.body.heiType, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId);

        Promise.all([mysqlAddPromise, neo4jAddPromise])
        .then((data) => {
            res.redirect('/addHighEducationInstitute');
        })
        .catch((err) => {
            res.render('message', {  //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addHighEducationInstitute"> Go Back</a>'   //provide a link that provides a links to another page
            });
        });
    });


    app.get('/editHighEducationInstituteById/:id', (req, res) => {
        
        HighEducationInstitute.getHighEducationInstituteById(req.params.id)
        .then(data => {
            res.render('highEducationInstitute/editHighEducationInstitute', {
                heis : data[0]
             });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err + '!',
                link : '<a href="/editHighEducationInstituteById/' + req.params.id + '"> Go Back</a>'
            });
        });
    });

    app.post('/editHighEducationInstituteById/:id', (req, res) => {
        
        let mysqlEditPromise = HighEducationInstitute.editHighEducationInstituteById(req.body.heiId, req.body.heiType, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId, req.params.id);
        let neo4jEditPromise = Neo4jHighEducationInstituteModel.editHighEducationInstituteById(req.body.heiId, req.body.heiType, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId, req.params.id);
        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllHighEducationInstitute');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editHighEducationInstituteById/' + req.body.heiId + '"> Go Back</a>'
            });
        });
    });

    app.get('/deleteHighEducationInstituteById/:id', (req, res) => {
        let mysqlDeletePromise = HighEducationInstitute.deleteHighEducationInstituteById(req.params.id);
        let neo4jDeletePromise = Neo4jHighEducationInstituteModel.deleteHighEducationInstituteById(req.params.id);
        Promise.all([mysqlDeletePromise, neo4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllHighEducationInstitute');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllHighEducationInstitute/' + req.params.heiName + '"> Go Back</a>'
            });
        })
    });
}