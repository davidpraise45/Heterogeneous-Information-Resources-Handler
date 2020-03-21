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
        }
    }
}

