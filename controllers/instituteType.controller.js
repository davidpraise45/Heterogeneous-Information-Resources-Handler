exports.InstituteTypeController = function(app, dbcon, mongodb) {
   
    const InstituteType = require('../models/mysql/typeOfInstitute.model.js').TypeOfInstitute(dbcon);

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

        InstituteType.addTypeOfInstituteInstitute(req.body.instituteTypeId, req.body.instituteTypeName)
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
        InstituteType.editTypeOfInstituteById(req.body.instituteTypeId, req.body.instituteTypeName, req.params.id)
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
        InstituteType.deleteTypeOfInstituteById(req.params.id)
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
}