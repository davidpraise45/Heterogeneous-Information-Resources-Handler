exports.OwnershipTypeController = function(app, dbcon, neo4j) {

    const OwnershipTypeModel = require('../models/mysql/ownershipType.model.js').OwnershipType(dbcon);
    const Neo4jOwnershipTypeModel = require('../models/neo4j/ownershipType.model.js').OwnershipTypeModel(neo4j); 
    
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
    }