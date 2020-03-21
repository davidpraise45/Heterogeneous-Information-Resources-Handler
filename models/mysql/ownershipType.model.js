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
        }
    }
}

