exports.TypeOfInstituteModel = function(neo4j) {
    return {
        addInstitute : function(id, name) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session(); 
                let query = 'MATCH(h:HighEducationInstitute {id : $id}) MERGE(i:Institute {id : $id, name : $name}) MERGE((i)-[r:BELONGS_TO]->(s)) RETURN h, i, r';
                session.run(query, {id : id, name : name})           
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

        editInstituteById : function(id, name, oldId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH((i:Institute{id:$oldId}) -[r:BELONGS_TO]-> (h:HighEducationInstitute {id:$oldId})) SET i.id = $id, i.name = $name RETURN h, i, r';
                session.run(query, {id : id, oldId:oldId, name : name})
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

        deleteInstituteById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(i:Institute {id : $id}) DETACH DELETE i';
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