exports.StateModel = function(neo4j) {
    return {
        getAllStates : function() {
            return new Promise((resolve, reject) => {
                //Create a neo4j session variable
                const session = neo4j.session();
                //A query that will retrieve all nodes with the label 'state'
                let query = 'MATCH(s:State) RETURN s';
                //Start a session with the neo4j server and execute the query
                session.run(query)
                .then(result => {
                    resolve(result);    //return the obtained data
                })
                .catch(err => {
                    reject(err);    //return the obtained error
                })
                .then(() => {
                    session.close();    //close the session after executing the query
                })
            })
        },

        getStateById : function(id) {
            return new Promise((resolve, reject) => {
                //Create a Neo4J session variable
                const session = neo4j.session();
                //A query that retieves a node with a label 'state'
                let query = 'MATCH(s:State {stateId : $id}) RETURN s';
                //Start a session with neo4j server and run the query
                session.run(query, {id : id})
                .then(result => {
                    resolve(result); //return the obtained data
                })
                .catch(err => {
                    reject(err);    //return the obtained error
                })
                .then(() => {
                    session.close();    //close the session after executing the query
                })
            })
        },

        addState : function(stateId, stateName, stateFoundationDate) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                //A query that will add a state node
                let query = 'MERGE(s:State {name : $name, stateId : $id, stateFoundationDate : $stateFoundationDate}) RETURN s';
                session.run(query, {name : stateName, id : stateId, stateFoundationDate :stateFoundationDate})
                .then(result => {
                    resolve(result);    //return the obtained data
                })
                .catch(err => {
                    reject(err);    //return the obtained error
                })
                .then(() => {
                    session.close();    //close the session after executing the query
                })
            })
        },

        editStateById : function(newId, stateName, stateFoundationDate, oldId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                //A query that will first match a state based on its ID, if the state exists, it will be upadated. Otherwise, no changes will occur
                let query = 'MATCH(s:State {stateId : $oldId})  SET s.stateId = $newId, s.name = $stateName, s.stateDate = $stateFoundationDate';
                session.run(query, {oldId : oldId, newId : newId, stateName : stateName, stateFoundationDate :stateFoundationDate})
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

        deleteStateById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                // MATCH(s:State {id : $id}) DETACH DELETE s
                //A query that first will match a state based on its ID and then delete it and all city nodes related to it.
                //let query = 'MATCH((c:City)-[r:BELONGS_TO]->(s:State {stateId : $id})) DETACH DELETE c,r,s';
                let query = 'MATCH(s:State {id : $id}) DETACH DELETE s';
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