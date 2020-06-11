exports.StateCollectionModel = function(mongo) {
    return {
        getAllDocuments : function() {
            return new Promise((resolve, reject) => {
                mongo.collection('states').find((err, result) => {  //Retrieve all documents from object collection
                    if(!err) {
                        resolve(result);  //return obtained results
                    } else {
                        reject(err);    //return obtained error
                    }
                });
            });
        },

        insertDocuments : function(document) {  
            return new Promise((resolve, reject) => {
                mongo.collection('states').insert(document, (err, result) => {    //insert a document passed by the controller when calling the function
                    if(!err) {
                        resolve(result);    //return obtained result
                    } else {
                        reject(err);    //return obtained error
                    }
                });
            });
        }
    }

}