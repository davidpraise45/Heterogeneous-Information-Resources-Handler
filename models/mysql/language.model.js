exports.LanguageModel = function(dbcon) {
    return {
        getAllLanguages : function(){
            return new Promise((resolve, reject) => {
                let query = 'SELECT * FROM LANGUAGES;';
                dbcon.query(query, (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        getLanguageById : function(id){
            return new Promise((resolve, reject) => {
                let query = "SELECT * FROM LANGUAGES JEZ_JEZIK = ? ;"
                dbcon.query(query, id, (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        addLanguage : function(languageId, language) {
            return new Promise((resolve, reject) => {
                let query = 'INSERT INTO LANGUAGES (JEZ_JEZIK, JEZ_NAZIV) VALUES (?, ?);';
                dbcon.query(query, [languageId, language], (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        },

        editLanguageById : function(newId, language, id){
            return new Promise((resolve, reject) => {
                let query = 'UPDATE LANGUAGES SET JEZ_JEZIK, JEZ_NAZIV = ? WHERE JEZ_NAZIV = ?;';
                dbcon.query(query, [newId, language, id], (err, data) => {
                    if(!err) {
                        resolve(data);      //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        deleteLanguageById : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM LANGUAGES WHERE JEZ_JEZIK LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
                    if(!err) {
                        resolve(data);  //return the query's result
                    } else {
                        reject(err);    //return error message
                    }
                });
            });
        },

        deleteLanguageByStateId : function(id){
            return new Promise((resolve, reject) => {
                let query = 'DELETE FROM LANGUAGES WHERE JEZ_JEZIK LIKE ?;';
                dbcon.query(query, [id], (err, data) => {
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
