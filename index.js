const { app, dbcon, mongo } = require('./core/app.config.js').AppConfig();

require('./controllers/main.controller.js').MainController(app, dbcon, mongo);
require('./controllers/state.controller.js').StateController(app, dbcon, mongo);
require('./controllers/populatedPlace.controller.js').PopulatedPlaceController(app, dbcon, mongo);
require('./controllers/language.controller.js').LanguageController(app, dbcon, mongo);
require('./controllers/highEducationInstitute.controller').HighEducationInstituteController(app, dbcon, mongo);
require('./controllers/document.controller.js').DocumentController(app, dbcon, mongo);