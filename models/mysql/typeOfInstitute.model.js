exports.TypeOfInstitute = function(dbcon){

    return {
        getAllTypeOfInstitute : function(){
            return new Promise((resolve, reject) => {
                let query = 'SELECT  TIP_UST, TIP_NAZIV FROM TYPES_OF_INSTITUTIONS;';
                dbcon.query(query, (err, data) => {
                    if(!err){
                        resolve(data);
                    }else{
                        reject(data);
                    }
                });
            });
        },

        getTypeOfInstituteById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'SELECT  TIP_UST, TIP_NAZIV FROM TYPES_OF_INSTITUTIONS WHERE TIP_UST LIKE ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        addTypeOfInstituteInstitute : function(id, name) {
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO TYPES_OF_INSTITUTIONS (TIP_UST, TIP_NAZIV) VALUES (?, ?);';
                dbcon.query(query, [id, name], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editTypeOfInstituteById : function(id, name, oldId){
            return new Promise((resolve, reject) => {
                let query = 'UPDATE TYPES_OF_INSTITUTIONS SET TIP_UST = ?,  TIP_NAZIV = ? WHERE TIP_UST LIKE ?';
                dbcon.query(query, [id, name, oldId], (err, data) => {
                    if(!err) {
                        resolve(data);      //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        deleteTypeOfInstituteById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM TYPES_OF_INSTITUTIONS WHERE TIP_UST LIKE ?;';
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

