const { app, dbcon, mongo, neo4j } = require('./core/app.config.js').AppConfig();

require('./controllers/main.controller.js').MainController(app, dbcon, mongo);
require('./controllers/state.controller.js').StateController(app, dbcon, neo4j);
require('./controllers/populatedPlace.controller.js').PopulatedPlaceController(app, dbcon, neo4j);
require('./controllers/language.controller.js').LanguageController(app, dbcon, neo4j);
require('./controllers/highEducationInstitute.controller').HighEducationInstituteController(app, dbcon, neo4j);
require('./controllers/instituteType.controller.js').InstituteTypeController(app, dbcon, neo4j);
require('./controllers/ownershipType.controller.js').OwnershipTypeController(app, dbcon, neo4j);
require('./controllers/document.controller.js').DocumentController(app, dbcon, mongo);
require('./controllers/graph.controller.js').GraphController(app, dbcon, neo4j);