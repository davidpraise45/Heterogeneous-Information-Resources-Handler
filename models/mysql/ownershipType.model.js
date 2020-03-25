exports.OwnershipType = function(dbcon){

    return {
        getAllOwnershipType : function(){
            return new Promise((resolve, reject) => {
                let query = 'SELECT VV_OZNAKA, VV_NAZIV FROM OWNERSHIP_TYPE;';
                dbcon.query(query, (err, data) => {
                    if(!err){
                        resolve(data);
                    }else{
                        reject(data);
                    }
                });
            });
        },

        getTypeOfOwnershipById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'SELECT VV_OZNAKA, VV_NAZIV FROM OWNERSHIP_TYPE WHERE VV_OZNAKA LIKE ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        addTypeOfOwnership : function(id, name) {
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO OWNERSHIP_TYPE (VV_OZNAKA, VV_NAZIV) VALUES (?, ?);';
                dbcon.query(query, [id, name], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editTypeOfOwnershipById : function(id, name, oldId){
            return new Promise((resolve, reject) => {
                let query = 'UPDATE OWNERSHIP_TYPE SET VV_OZNAKA = ?,  VV_NAZIV = ? WHERE VV_OZNAKA LIKE ?';
                dbcon.query(query, [id, name, oldId], (err, data) => {
                    if(!err) {
                        resolve(data);      //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        deleteTypeOfOwnershipById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM OWNERSHIP_TYPE WHERE VV_OZNAKA LIKE ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        }
    }
}

