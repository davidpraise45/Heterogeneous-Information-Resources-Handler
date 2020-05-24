exports.GraphController = (app, dbcon, mongo, neo4j) => {

    app.get('/displayGraph', (req, res) => {
        res.render('displayGraph');
    });
}