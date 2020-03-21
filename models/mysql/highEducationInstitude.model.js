exports.HighEducationInstitute = function(dbcon) {
    return {
        getAllHighEducationInstitute : function(){
            return new Promise((resolve, reject) => {
                let query = 'SELECT  TIP_UST, VU_IDENTIFIKATOR, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA FROM HIGH_EDUCATION_INSTITUTION;';
                dbcon.query(query, (err, data) => {
                    console.log(data);
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        getHighEducationInstituteById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'SELECT TIP_UST, VU_IDENTIFIKATOR, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA FROM HIGH_EDUCATION_INSTITUTION WHERE TIP_UST = ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        addHighEducationInstitute : function(heiType, heiId, heiName, heiStateId, heiOwnershipId) {
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO HIGH_EDUCATION_INSTITUTION (TIP_UST, VU_IDENTIFIKATOR, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA) VALUES (?, ?, ?, ?, ?);';
                dbcon.query(query, [heiType, heiId, heiName, heiStateId, heiOwnershipId], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editHighEducationInstituteById : function(heiType, heiId, heiName, heiStateId, heiOwnershipId){
            return new Promise((resolve, reject) => {
                let query = 'UPDATE HIGH_EDUCATION_INSTITUTION SET TIP_UST = ?, VU_IDENTIFIKATOR = ?, VU_NAZIV = ?, DR_IDENTIFIKATOR = ?, VV_OZNAKA = ? WHERE VU_NAZIV = ?;';
                dbcon.query(query, [heiType, heiId, heiName, heiStateId, heiOwnershipId], (err, data) => {
                    if(!err) {
                        resolve(data);      //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        deleteHighEducationInstituteById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM HIGH_EDUCATION_INSTITUTION WHERE VU_NAZIV = ?;';
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
