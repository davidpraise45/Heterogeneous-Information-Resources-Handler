exports.DocumentController = function(app, dbcon, mongo) {

    const DocumentCollection = require('../models/mongodb/document.collection.js').DocumentCollectionModel(mongo);
    const StateModel = require('../models/mysql/state.model.js').StateModel(dbcon);
    const PopulatedPlaceModel = require('../models/mysql/populatedPlace.model.js').PopulatedPlaceModel(dbcon);
    const LanguageModel = require('../models/mysql/language.model.js').LanguageModel(dbcon);
    const HighEducationInstituteModel = require('../models/mysql/highEducationInstitude.model.js').HighEducationInstitute(dbcon);
    const OwnershipTypeModel = require('../models/mysql/ownershipType.model.js').OwnershipType(dbcon);
    const TypeOfInstituteModel = require('../models/mysql/typeOfInstitute.model.js').TypeOfInstitute(dbcon);

    app.get('/getAllDocuments', (req, res) => {
        DocumentCollection.getAllDocuments()
        .then((data) => {
            res.render('allDocuments', {
                documents : data
            });
        })
        .catch((err) => {

        });
    });
    
    app.get('/generateAllDocument', (req, res) => {
        const allStates = StateModel.getAllStates(); 
        const allPopulatedPlaces = PopulatedPlaceModel.getAllPopulatedPlaces();
        const allLanguage = LanguageModel.getAllLanguages();
        const allHEI = HighEducationInstituteModel.getAllHighEducationInstitute();
        const allTypeOfInstitute = TypeOfInstituteModel.getAllTypeOfInstitute();
        const allOwnershipType = OwnershipTypeModel.getAllOwnershipType();

        Promise.all([allStates, allPopulatedPlaces, allLanguage, allHEI, allTypeOfInstitute, allOwnershipType])
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/getAllDocuments"> Go Back</a>'
            });
        })
        .then(([states, cities, languages, highEducationInstitutes, institutionType, ownershipType]) => {
            return new Promise((resolve, reject) => {

                highEducationInstitutes = highEducationInstitutes.map(hei => {
                    return {
                        id : hei.VU_IDENTIFIKATOR,
                        instituteName : hei.VU_NAZIV,
                        instituteType : institutionType.filter(typeInstitute => typeInstitute.TIP_UST == hei.TIP_UST),
                        states : states.filter(state => state.DR_IDENTIFIKATOR == hei.DR_IDENTIFIKATOR)
                        .map(state => {
                            return {
                                id : state.DR_IDENTIFIKATOR,
                                name : state.DR_NAZIV,
                                foundationDate : state.DR_DATUM_OSNIVANJA,
                                numberOfCities : cities.filter(city => city.DR_IDENTIFIKATOR == state.DR_IDENTIFIKATOR).length,
                                cities : cities.filter(city => city.DR_IDENTIFIKATOR == state.DR_IDENTIFIKATOR)
                                .map(city => {
                                    return {
                                        id : city.NM_IDENTIFIKATOR,
                                        name : city.NM_NAZIV,
                                        zip : city.NM_PTT_CODE
                                    }
                                })
                            }
                        }),
                        ownershipType : ownershipType.filter(typerOwnership => typerOwnership.VV_OZNAKA == hei.VV_OZNAKA)
                    }
                });

                if(highEducationInstitutes.length == 0) {
                    reject('No Document!');
                }

                resolve({
                    created_at : JSON.stringify(new Date()),
                    highEducationInstitutes : highEducationInstitutes
                });
            });
        })
        .catch((err) => {
            res.render('message', {      //In case the query fail. Render 'message.ejs' and display the obtained error message
                errorMessage : 'ERROR: ' + err,
                link : '<a href="/"> Go Back</a>'
            });
        })
        .then((allDocuments) => {
            DocumentCollection.insertDocuments(allDocuments)
            .then(() => {
                res.redirect('/getAllDocuments');
            });
        })
    });
}
