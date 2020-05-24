exports.Neo4jConnection = function(){
    const config = {
        hostname : 'localhost',
        username : 'neo4j',
        password : 'neo4j'
    }

    const neo4jDriver = require('neo4j-driver');

    return neo4jDriver.driver(
        'neo4j://'+ config.hostname,
        neo4jDriver.auth.basic(config.username, config.password)
    );
}