exports.DocumentCollectionModel = function(mongo) {
    return {
        getAllDocuments : function() {
            return new Promise((resolve, reject) => {
                mongo.collection('Document').find((err, result) => {  //Retrieve all documents from states collection
                    if(!err) {
                        resolve(result);  //return obtained results
                    } else {
                        reject(err);    //return obtained error
                    }
                });
            });
        },

        insertDocuments : function(document) {  //statesDocuments is an object with all states to insert in the 'states' collection. This argument is fulfilled by the controller
            return new Promise((resolve, reject) => {
                mongo.collection('Document').insert(document, (err, result) => {    //insert a document passed by the controller when calling the function
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