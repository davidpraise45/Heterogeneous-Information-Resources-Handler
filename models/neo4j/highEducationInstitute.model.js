exports.HighEducationInstituteModel = function(neo4j) {
    return {
        addHighEducationInstitute : function(heiId, heiType, heiName, heiStateId, heiOwnershipId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(s:State {stateId : $heiStateId}) MERGE(h:HighEducationInstitute {heiId : $heiId, heiType : $heiType, heiName : $heiName, heiStateId : $heiStateId, heiOwnershipId: $heiOwnershipId}) MERGE((h)-[r:LOCATED_IN]->(s)) RETURN s, h, r';
                session.run(query, {heiType : heiType, heiId : heiId, heiName : heiName, heiStateId : heiStateId, heiOwnershipId: heiOwnershipId})
                .then(result => {
                    resolve(result);  
                })
                .catch(err => {
                    reject(err);   
                })
                .then(() => {
                    session.close();  
                })
            })
        },

        editHighEducationInstituteById : function(heiId, heiType, heiName, heiStateId, heiOwnershipId, oldHeiId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH((h:HighEducationInstitute {oldHeiId : $oldHeiId}) -[r:LOCATED_IN]-> (s:State {stateId : $heiStateId}))  SET h.heiType = $heiType, h.heiId = $heiId, h.heiName = $heiName, h.heiStateId = $heiStateId, h.heiOwnershipId = $heiOwnershipId RETURN s, h, r';
                session.run(query, {heiType : heiType, heiId: heiId, heiName : heiName, heiStateId : heiStateId, oldHeiId : oldHeiId, heiOwnershipId: heiOwnershipId})
                .then(result => {
                    resolve(result);
                })
                .catch(err => {
                    reject(err);
                })
                .then(() => {
                    session.close();
                })
            })
        },

        deleteHighEducationInstituteById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(h:HighEducationInstitute {id : $id}) DETACH DELETE h';
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
            })
        }
    };
}