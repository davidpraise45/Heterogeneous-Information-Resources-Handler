exports.MongodbConnection = function() {
    const mongo = require('mongojs')('localhost:27017/crud_db');    //Establish a connection to MongoDB database

    return mongo;   //Return connection object to make it available to models
}