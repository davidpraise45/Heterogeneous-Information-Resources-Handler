exports.LanguageModel = function(neo4j) {
    return {
        addLanguage : function(languageId, language) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(s:State {stateId : $languageId}) MERGE(l:Language {languageId : $languageId, language : $language}) MERGE((l)-[r:USED_IN]->(s)) RETURN s, l, r';
                session.run(query, {languageId : languageId, language : language})
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

        editLanguageById : function(languageId, language, oldLanguageId) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH((l:languageId {languageId : $oldLanguageId}) -[r:USED_IN]-> (s:State {stateId : $languageId}))  SET l.languageId = $languageId, l.language = $language RETURN s, l, r';
                session.run(query, {languageId : languageId, language: language, oldLanguageId : oldLanguageId})
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

        deleteLanguageById : function(id) {
            return new Promise((resolve, reject) => {
                const session = neo4j.session();
                let query = 'MATCH(l:Language {id : $id}) DETACH DELETE l';
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