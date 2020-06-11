exports.InstituteTypeController = function(app, dbcon, mongo, neo4j) {
   
    const InstituteType = require('../models/mysql/typeOfInstitute.model.js').TypeOfInstitute(dbcon);
    const Neo4jInstituteTypeModel = require('../models/neo4j/typeOfInstitute.model.js').TypeOfInstituteModel(neo4j);
    const instituteCollection = require('../models/mongodb/typeOfInstitute.collection.js').InstituteTypeCollectionModel(mongo);


    app.get('/getAllInstituteType', (req, res) => {
        InstituteType.getAllTypeOfInstitute()
        .then(data => {
            res.render('instituteType/instituteType', {     //after successfully excuting the query, render the 'message.ejs' view in order to display the message
                instiType : data
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err,
                link : ''
            }); 
        })
    });

    app.get('/addInstituteType', (req, res) => {
        InstituteType.getAllTypeOfInstitute()   //Call model function that return all states from the database
        .then((data) => {
            res.render('instituteType/addInstituteType', {
                instiType : data,
            });
        })
        .catch((err) => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err + '!',
                link : 'ERROR'
            });
        })
    });

    app.post('/addInstituteType', (req, res) => {


        let mysqlAddPromise = InstituteType.addTypeOfInstituteInstitute(req.body.instituteTypeId, req.body.instituteTypeName);
        let neo4jAddPromise = Neo4jInstituteTypeModel.addInstitute(req.body.instituteTypeId, req.body.instituteTypeName)


        Promise.all([mysqlAddPromise, neo4jAddPromise])
        .then((data) => {
            res.redirect('addInstituteType');
        })
        .catch((err) => {
            res.render('message', {  //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/addInstituteType"> Go Back</a>'   //provide a link that provides a links to another page
            });
        });
    });


    app.get('/editInstituteTypeById/:id', (req, res) => {
   
        InstituteType.getTypeOfInstituteById(req.params.id)
        .then(data => {
            res.render('instituteType/editInstituteType', {
                instiType : data[0]   
            });
        })
        .catch(err => {
            res.render('message', {
                errorMessage : 'ERROR: ' + err + '!',
                link : '<a href="/editInstituteTypeById/' + req.params.id + '"> Go Back</a>'
            });
        });
    });

    app.post('/editInstituteTypeById/:id', (req, res) => {

        let mysqlEditPromise = InstituteType.editTypeOfInstituteById(req.body.instituteTypeId, req.body.instituteTypeName, req.params.id);
        let neo4jEditPromise = Neo4jInstituteTypeModel.editInstituteById(req.body.instituteTypeId, req.body.instituteTypeName, req.params.id);
        Promise.all([mysqlEditPromise, neo4jEditPromise])
        .then((data) => {
            res.redirect('/getAllInstituteType');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editInstituteTypeById/' + req.params.id + '"> Go Back</a>'
            });
        });
    });

    app.get('/deleteInstituteTypeById/:id', (req, res) => {
        let mysqlDeletePromise = InstituteType.deleteTypeOfInstituteById(req.params.id);
        let neo4jDeletePromise = Neo4jInstituteTypeModel.deleteInstituteById(req.params.id);
        Promise.all([mysqlDeletePromise, neo4jDeletePromise])
        .then((data) => {
            res.redirect('/getAllInstituteType');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllInstituteType/' + req.params.id + '"> Go Back</a>'
            });
        })
    });

    // This is for generating the state documents
    app.get('/getInstituteDocument', (req, res) => {
        instituteCollection.getAllDocuments()
        .then((data) => {
            res.render('typeOfInstituteDocument', {
                documents : data
            });
        })
        .catch((err) => {

        });
    });

    app.get('/generateInstituteDocument', (req, res) => {
        const allInstitute = InstituteType.getAllTypeOfInstitute(); 

        Promise.all([allInstitute])
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/generateInstituteDocument"> Go Back</a>'
            });
        })
        .then(([allInstitute]) => {
            return new Promise((resolve, reject) => {

                allInstitute = allInstitute.map(insti => {
                    return {
                        instituteType : insti.TIP_UST,
                        instituteName : insti.TIP_NAZIV
                    }
                });

                if(allInstitute.length == 0) {
                    reject('No Institute Document!');
                }

                resolve({
                    created_at : JSON.stringify(new Date()),
                    allInstitute : allInstitute
                });
            });
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/"> Go Back</a>'
            });
        })
        .then((typeOfInstituteDocument) => {
            instituteCollection.insertDocuments(typeOfInstituteDocument)
            .then(() => {
                res.redirect('/getInstituteDocument');
            });
        })
    });


}