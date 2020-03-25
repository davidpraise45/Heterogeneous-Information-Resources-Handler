exports.HighEducationInstituteController = function(app, dbcon) {
    const HighEducationInstitute = require('../models/mysql/highEducationInstitude.model').HighEducationInstitute(dbcon); 

    app.get('/getAllHighEducationInstitute', (req, res) => {
        HighEducationInstitute.getAllHighEducationInstitute()
        .then(data => {
            res.render('highEducationInstitute/highEducationInstitute', {     //after successfully excuting the query, render the 'message.ejs' view in order to display the message
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
        HighEducationInstitute.getAllHighEducationInstitute()   //Call model function that return all states from the database
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

        let getAllHighEducationInstitute = HighEducationInstitute.getAllHighEducationInstitute();
        let addHighEducationInstitute = HighEducationInstitute.addHighEducationInstitute(req.body.heiType, req.body.heiId, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId);
        
        Promise.all([getAllHighEducationInstitute, addHighEducationInstitute])
        .then((data) => {
            //Check whether a populated place with the same ID exists or no
            for (let hei of data[0]) {   //data[0] represents the element of the array returned by Promise.all(), which is an array of objects of all populated places
                if (hei.TIP_UST == req.body.heiType || hei.VU_IDENTIFIKATOR == req.body.heiId || hei.VU_NAZIV == req.body.heiName || hei.DR_IDENTIFIKATOR == req.body.heiStateId || hei.VV_OZNAKA == req.body.heiOwnershipId) {
                    return res.render('message', {
                        errorMessage : 'High Education ' + req.body.heiName + ' or ID ' + req.body.heiId + ', already exists, try again!',
                        link : '<a href="/addHighEducationInstitute"> Go Back</a>'   //provide a link that provides a links to another page
                    });
                }
            }
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
   
        
        let getAllHighEducationInstitute = HighEducationInstitute.getHighEducationInstituteById(req.params.id)
        .then(data => {
            res.render('highEducationInstitute/editHighEducationInstitute', {
                heis : data[0]   //Because Promise.all() returns two arrays, the first one '[0]' will be the result of promise 'getAllStates'
                //languages: data[1][0]  //and the second one '[1]' will be the result of the promise getLanguage, which in turn returns only one row
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
        HighEducationInstitute.editHighEducationInstituteById(req.body.heiType, req.body.heiName, req.body.heiStateId, req.body.heiOwnershipId, req.params.id)
        .then((data) => {
            res.redirect('/getAllHighEducationInstitute');
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/editHighEducationInstituteById/' + req.params.heiName + '"> Go Back</a>'
            });
        });
    });

    app.get('/deleteHighEducationInstituteById/:id', (req, res) => {
        HighEducationInstitute.deleteHighEducationInstituteById(req.params.id)
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