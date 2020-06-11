exports.HighEducationInstituteController = function(app, dbcon, mongo, neo4j) {
    const HighEducationInstitute = require('../models/mysql/highEducationInstitude.model').HighEducationInstitute(dbcon); 
    const Neo4jHighEducationInstituteModel = require('../models/neo4j/highEducationInstitute.model.js').HighEducationInstituteModel(neo4j);
    const heiCollection = require('../models/mongodb/highEducationInstitute.collection.js').HighEducationInstituteCollectionModel(mongo);


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

     
    // This is for generating the high education institute documents
    app.get('/getHighEducationInstituteDocument', (req, res) => {
        heiCollection.getAllDocuments()
        .then((data) => {
            res.render('highEducationInstituteDocument', {
                documents : data
            });
        })
        .catch((err) => {

        });
    });

    app.get('/generateHighEducationInstituteDocument', (req, res) => {
        const allheis = HighEducationInstitute.getAllHighEducationInstitute(); 

        Promise.all([allheis])
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getHighEducationInstituteDocument"> Go Back</a>'
            });
        })
        .then(([allheis]) => {
            return new Promise((resolve, reject) => {

                allheis = allheis.map(hei => {
                    return {
                        highEducationInstituteId : hei.VU_IDENTIFIKATOR,
                        highEducationInstituteType : hei.TIP_UST,
                        highEducationInstituteName : hei.VU_NAZIV,
                        highEducationInstituteStateId : hei.DR_IDENTIFIKATOR,
                        highEducationInstituteOwnershipType : hei.VV_OZNAKA
                    }
                });

                if(allheis.length == 0) {
                    reject('No High Education Institute Document!');
                }

                resolve({
                    created_at : JSON.stringify(new Date()),
                    allheis : allheis
                });
            });
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/"> Go Back</a>'
            });
        })
        .then((highEducationInstituteDocument) => {
            heiCollection.insertDocuments(highEducationInstituteDocument)
            .then(() => {
                res.redirect('/getHighEducationInstituteDocument');
            });
        })
    });

}