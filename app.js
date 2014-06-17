/*jslint nomen:true, node:true*/

var
  express = require('express'),
  libmojito = require('mojito'),
  connectSessionMiddleware = require('./middleware/connect-session.js'),
  passportMiddleware = require('./middleware/passport.js'),
  passportSessionMiddleware = require('./middleware/passport-session.js'),
  app;

app = express();

// Set the port to listen on.
app.set('port', process.env.PORT || 3300);

// Create a new Mojito instance and attach it to `app`.
// Options can be passed to `extend`.
libmojito.extend(app, {
  context: {
    // environment: "development"
    environment: "production"
  }
});

// Load the built-in middleware or any middleware
// configuration specified in application.json
//
// The following line connects all mojito middleware in a pre-determined
// sequence; we can't do it that way because we need to plug our session
// middleware right after the cookie parser.
// app.use(libmojito.middleware());
//
// Instead, we link all middleware explicitly.
//
// https://github.com/yahoo/mojito/wiki/07.-Mojito-v0.9:-Using-Middleware#user-content-selecting-mojito-middleware
//
app.use(libmojito.middleware['mojito-handler-static']());
app.use(libmojito.middleware['mojito-parser-body']());
app.use(libmojito.middleware['mojito-parser-cookies']());
app.use(connectSessionMiddleware);
app.use(passportMiddleware);
app.use(passportSessionMiddleware);
app.use(libmojito.middleware['mojito-contextualizer']());
app.use(libmojito.middleware['mojito-handler-tunnel']());

// Load routes configuration from routes.json
app.mojito.attachRoutes();

// Allow anonymyous mojit instances w/ actions to be dispatched
app.get('/:mojit/:action', libmojito.dispatch("{mojit}.{action}"));

app.listen(app.get('port'), function () {
  console.log('Server listening on port ' + app.get('port') + ' ' + 'in ' + app.get('env') + ' mode');
});


