exports.HomeModel = function(dbcon) {
    return {
        displayAll : function() {
            return new Promise((resolve, reject) => {
                let query = "SELECT STATE.DR_IDENTIFIKATOR, STATE.DR_NAZIV, STATE.DR_DATUM_OSNIVANJA, LANGUAGES.JEZ_NAZIV, POPULATED_PLACES.NM_NAZIV, POPULATED_PLACES.NM_PTT_CODE FROM STATE INNER JOIN LANGUAGES ON STATE.DR_IDENTIFIKATOR = LANGUAGES.JEZ_JEZIK INNER JOIN POPULATED_PLACES ON STATE.DR_IDENTIFIKATOR = POPULATED_PLACES.DR_IDENTIFIKATOR;";
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