exports.OwnershipTypeController = function(app, dbcon, mongo, neo4j) {

    const OwnershipTypeModel = require('../models/mysql/ownershipType.model.js').OwnershipType(dbcon);
    const Neo4jOwnershipTypeModel = require('../models/neo4j/ownershipType.model.js').OwnershipTypeModel(neo4j); 
    const ownershipTypeCollection = require('../models/mongodb/ownership.collection.js').OwnershipTypeCollectionModel(mongo);

    
        app.get('/getAllOwnershipType', (req, res) => {
            OwnershipTypeModel.getAllOwnershipType()
            .then(data => {
                res.render('ownershipType/ownershipType', {   
                    ownershipType : data
                });
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage : 'ERROR: ' + err,
                    link : ''
                }); 
            })
        });
    
        app.get('/addOwnershipType', (req, res) => {
            OwnershipTypeModel.getAllOwnershipType() 
            .then((data) => {
                res.render('ownershipType/addOwnershipType', {
                    ownershipType : data,
                });
            })
            .catch((err) => {
                res.render('message', {
                    errorMessage : 'ERROR: ' + err + '!',
                    link : 'ERROR'
                });
            })
        });
    
        app.post('/addOwnershipTypeById/', (req, res) => {

            let mysqlAddPromise = OwnershipTypeModel.addTypeOfOwnership(req.body.ownershipTypeId, req.body.ownershipTypeName);
            let neojAddPromise = Neo4jOwnershipTypeModel.addOwnershipType(req.body.ownershipTypeId, req.body.ownershipTypeName);
            Promise.all([mysqlAddPromise, neojAddPromise])
            .then((data) => {
                res.redirect('addOwnershipType');
            })
            .catch((err) => {
                res.render('message', {  //In case the query fail. Render 'message.ejs' and display the obtained error message
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/addOwnershipType"> Go Back</a>'   //provide a link that provides a links to another page
                });
            });
        });
    
    
        app.get('/editOwnershipTypeById/:id', (req, res) => {
       
            OwnershipTypeModel.getTypeOfOwnershipById(req.params.id)
            .then(data => {
                res.render('ownershipType/editOwnershipType', {
                    ownershipType : data[0]   
                });
            })
            .catch(err => {
                res.render('message', {
                    errorMessage : 'ERROR: ' + err + '!',
                    link : '<a href="/editOwnershipTypeById/' + req.params.id + '"> Go Back</a>'
                });
            });
        });
    
        app.post('/editOwnershipTypeById/:id', (req, res) => {

            let mysqlEditPromise = OwnershipTypeModel.editTypeOfOwnershipById(req.body.ownershipTypeId, req.body.ownershipTypeName, req.params.id);
            let neo4jEditPromise = Neo4jOwnershipTypeModel.editOwnershipTypeById(req.body.ownershipTypeId, req.body.ownershipTypeName, req.params.id);
            Promise.all([mysqlEditPromise, neo4jEditPromise])
            .then((data) => {
                res.redirect('/getAllOwnershipType');
            })
            .catch((err) => {
                res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/editOwnershipTypeById/' + req.params.id + '"> Go Back</a>'
                });
            });
        });
    
        app.get('/deleteOwnershipTypeById/:id', (req, res) => {
            let mysqlDeletePromise = OwnershipTypeModel.deleteTypeOfOwnershipById(req.params.id);
            let neo4jDeletePromise = Neo4jOwnershipTypeModel.deleteOwnershipTypeById(req.params.id);
            Promise.all([mysqlDeletePromise, neo4jDeletePromise])
            .then((data) => {
                res.redirect('/getAllOwnershipType');
            })
            .catch((err) => {
                res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/getAllOwnershipType/' + req.params.id + '"> Go Back</a>'
                });
            })
        });


        // This is for generating the state documents
        app.get('/getOwnershipTypeDocument', (req, res) => {
            ownershipTypeCollection.getAllDocuments()
            .then((data) => {
                res.render('ownershipTypeDocument', {
                    documents : data
                });
            })
            .catch((err) => {

            });
        });

        app.get('/generateOwnershipTypeDocument', (req, res) => {
            const allOwnershipType = OwnershipTypeModel.getAllOwnershipType(); 
    
            Promise.all([allOwnershipType])
            .catch((err) => {
                res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/generateOwnershipTypeDocument"> Go Back</a>'
                });
            })
            .then(([allOwnershipType]) => {
                return new Promise((resolve, reject) => {
    
                    allOwnershipType = allOwnershipType.map(ownerType => {
                        return {
                            ownershipType : ownerType.VV_OZNAKA,
                            ownershipName : ownerType.VV_NAZIV
                        }
                    });
    
                    if(allOwnershipType.length == 0) {
                        reject('No Ownership Type Document!');
                    }
    
                    resolve({
                        created_at : JSON.stringify(new Date()),
                        allOwnershipType : allOwnershipType
                    });
                });
            })
            .catch((err) => {
                res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                    errorMessage : 'ERROR: ' + err,
                    link : '<a href="/"> Go Back</a>'
                });
            })
            .then((ownershipTypeDocument) => {
                ownershipTypeCollection.insertDocuments(ownershipTypeDocument)
                .then(() => {
                    res.redirect('/getOwnershipTypeDocument');
                });
            })
        });

    }