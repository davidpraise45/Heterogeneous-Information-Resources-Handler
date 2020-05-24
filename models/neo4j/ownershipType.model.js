exports.OwnershipTypeModel = function(neo4j) {
    return {
        addOwnershipType : function(id, name) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session(); 
                let query = 'MATCH(h:HighEducationInstitute {id : $id}) MERGE(o:OwnershipType {id : $id, name : $name}) MERGE((o)-[r:MANAGED_BY]->(s)) RETURN h, o, r';
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

        editOwnershipTypeById : function(id, name, oldId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH((o:OwnershipType{oldId:$oldId}) -[r:MANAGED_BY]-> (h:HighEducationInstitute {oldId:$oldId})) SET o.id = $id, o.name = $name RETURN h, o, r';
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

        deleteOwnershipTypeById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(o:OwnershipType {id : $id}) DETACH DELETE o';
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