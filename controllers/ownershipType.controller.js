exports.OwnershipTypeController = function(app, dbcon, mongo) {

    const OwnershipTypeModel = require('../models/mysql/ownershipType.model.js').OwnershipType(dbcon); 
    
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
    
        app.post('/addOwnershipType', (req, res) => {
    
            OwnershipTypeModel.addTypeOfOwnership(req.body.ownershipTypeId, req.body.ownershipTypeName)
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
            OwnershipTypeModel.editTypeOfOwnershipById(req.body.ownershipTypeId, req.body.ownershipTypeName, req.params.id)
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
            OwnershipTypeModel.deleteTypeOfOwnershipById(req.params.id)
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