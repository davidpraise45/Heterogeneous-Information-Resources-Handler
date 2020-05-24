exports.HighEducationInstitute = function(dbcon) {
    return {
        getAllHighEducationInstitute : function(){
            return new Promise((resolve, reject) => {
                let query = 'SELECT  TIP_UST, VU_IDENTIFIKATOR, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA FROM HIGH_EDUCATION_INSTITUTION;';
                dbcon.query(query, (err, data) => {
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
                let query = 'SELECT TIP_UST, VU_IDENTIFIKATOR, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA FROM HIGH_EDUCATION_INSTITUTION WHERE VU_IDENTIFIKATOR = ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data); 
                    } else {
                        reject(err);   
                    }
                });
            });
        },

        addHighEducationInstitute : function(heiId, heiType, heiName, heiStateId, heiOwnershipId) {
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO HIGH_EDUCATION_INSTITUTION (VU_IDENTIFIKATOR, TIP_UST, VU_NAZIV, DR_IDENTIFIKATOR, VV_OZNAKA) VALUES (?, ?, ?, ?, ?);';
                dbcon.query(query, [heiId, heiType, heiName, heiStateId, heiOwnershipId], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editHighEducationInstituteById : function(heiId, heiType, heiName, heiStateId, heiOwnershipId, id){
            return new Promise((resolve, reject) => {
                let query = 'UPDATE HIGH_EDUCATION_INSTITUTION SET VU_IDENTIFIKATOR = ?, TIP_UST = ?,  VU_NAZIV = ?, DR_IDENTIFIKATOR = ?, VV_OZNAKA = ? WHERE VU_IDENTIFIKATOR = ?;';
                dbcon.query(query, [heiId, heiType, heiName, heiStateId, heiOwnershipId, id], (err, data) => {
                    if(!err) {
                        resolve(data);    
                    } else {
                        reject(err); 
                    }
                });
            });
        },

        deleteHighEducationInstituteById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM HIGH_EDUCATION_INSTITUTION WHERE VU_IDENTIFIKATOR = ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data); 
                    } else {
                        reject(err);  
                    }
                });
            });
        },

        deleteHighEducationInstituteByStateId : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM HIGH_EDUCATION_INSTITUTION WHERE VU_IDENTIFIKATOR = ?;';
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  
                    } else {
                        reject(err);   
                    }
                });
            });
        }
    }
}
