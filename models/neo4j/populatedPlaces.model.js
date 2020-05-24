exports.PopulatedPlaceModel = function(neo4j) {
    return {
        addPopulatedPlace : function(stateId, id, name, pttCode) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(s:State {stateId : $stateId}) MERGE(c:City {cityId : $id, name : $name, zip : $pttCode}) MERGE((c)-[r:BELONGS_TO]->(s)) RETURN s, c, r';
                session.run(query, {stateId : stateId, id : id, name : name, pttCode : pttCode})           
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                });
            });
        },

        editPopulatedPlaceById : function(stateId, newId, name, pttCode, id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH( (c:City{cityId:$id}) -[r:BELONGS_TO]-> (s:State {stateId:$stateId})) SET c.cityId = $newId, c.name = $name, c.zip = $pttCode RETURN s, c, r';
                session.run(query, {stateId : stateId, newId : newId, name : name, pttCode : pttCode, id : id,})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                });
            });
        },

        deletePopulatedPlaceById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(c:City {cityId : $id}) DETACH DELETE c';
                session.run(query, {id : id})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                })
            });
        }
    };
}