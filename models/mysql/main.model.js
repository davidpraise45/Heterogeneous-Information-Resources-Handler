exports.HomeModel = function(dbcon) {
    return {
        displayAll : function() {
            return new Promise((resolve, reject) => {
                let query = `SELECT OWNERSHIP_TYPE.VV_NAZIV, TYPES_OF_INSTITUTIONS.TIP_NAZIV, HIGH_EDUCATION_INSTITUTION.VU_NAZIV, POPULATED_PLACES.NM_NAZIV, STATE.DR_NAZIV, LANGUAGES.JEZ_NAZIV, STATE.DR_DATUM_OSNIVANJA, POPULATED_PLACES.NM_PTT_CODE
                FROM STATE 
                    INNER JOIN LANGUAGES ON STATE.DR_IDENTIFIKATOR = LANGUAGES.JEZ_JEZIK
                    INNER JOIN POPULATED_PLACES ON STATE.DR_IDENTIFIKATOR = POPULATED_PLACES.DR_IDENTIFIKATOR 
                    INNER JOIN HIGH_EDUCATION_INSTITUTION ON STATE.DR_IDENTIFIKATOR = HIGH_EDUCATION_INSTITUTION.DR_IDENTIFIKATOR
                    INNER JOIN OWNERSHIP_TYPE ON HIGH_EDUCATION_INSTITUTION.VV_OZNAKA = OWNERSHIP_TYPE.VV_OZNAKA
                    INNER JOIN TYPES_OF_INSTITUTIONS ON HIGH_EDUCATION_INSTITUTION.TIP_UST = TYPES_OF_INSTITUTIONS.TIP_UST;`;
                dbcon.query(query, (err, data) => {
                    if ( !err ) {
                        resolve(data);
                    } else {
                        reject(err);
                    }
                });
            });
        }
    }
}