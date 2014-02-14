/*global require: false, module: false, console: false */

var
  passport = require('passport'),
  passport_session = passport.session();

module.exports = function (req, res, next) {
  console.log('passport-session middleware url: ' + req.url);

  // we want to take control of the middleware so we can
  // initialize and also attach passport into req object
  passport_session(req, res, function (err) {
    if (err) {
      return next(err);
    }
    // Not sure if i attach to anything
    if (!req.isAuthenticated() && !req.url.match(/login/)) {
      console.log('middleware/passport-session/passport session(): unauthenticated; redirecting');
      // res.send('Please <a href="/login">log in</a>');
      req.method = 'post';
      res.redirect('/login');
    }
    else {
      console.log('middleware/passport-session/passport session(): user ' + req._passport.session.user);
      // returning control back to mojito flow
      next();
    }
  });
};
