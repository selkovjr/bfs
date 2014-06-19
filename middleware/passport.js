/*global require: false, module: false, console: false */

var
  passport = require('passport'),
  crypto = require('crypto'),
  LocalStrategy = require("passport-local").Strategy,
  initialize;

var users = [
  {
    id: 1,
    username: 'owner',
    password: '51b704fee27083614e65a9b7dbdf91b9',
    name: 'Omnipotent Test User',
    em: ['selkovjr', 'nsl25'],
    ail: ['gmail.com', 'cam.ac.uk'],
    auth: {
      samples: true,
      diagnostics: true
    }
  },
  {
    id: 2,
    username: 'scout',
    password: '51b704fee27083614e65a9b7dbdf91b9',
    name: 'Feild Sample Collector',
    em: ['selkovjr', 'nsl25'],
    ail: ['gmail.com', 'cam.ac.uk'],
    auth: {
      samples: true
    }
  },
  {
    id: 3,
    username: 'labrat',
    password: '51b704fee27083614e65a9b7dbdf91b9',
    name: 'Lab Rat',
    em: ['selkovjr', 'nsl25'],
    ail: ['gmail.com', 'cam.ac.uk'],
    auth: {
      diagnostics: true
    }
  },
  {
    id: 4,
    username: 'visitor',
    password: 'd663f408947a01a651c3d54986186764',
    name: 'Anonymous Reader',
    auth: {}
  },
  {
    id: 5,
    username: 'nic',
    password: 'd663f408947a01a651c3d54986186764',
    name: 'Nicola Lewis',
    em: ['nsl25'],
    ail: ['cam.ac.uk'],
    org: 'University of Cambridge',
    auth: {
      samples: true,
      diagnostics: true
    }
  },
  {
    id: 6,
    username: 'zura',
    password: '600a7b121f26a0cb5ce2b9a093e86186',
    name: 'Zura Javakhishvili',
    em: ['zurab.javakhishvili.1'],
    ail: ['iliauni.edu.ge'],
    org: 'Ilia State University',
    auth: {
      samples: true,
      diagnostics: true
    }
  },
  {
    id: 7,
    username: 'jimsher',
    password: 'd663f408947a01a651c3d54986186764',
    name: 'Jimsher Mamuchadze',
    em: ['mamuchadze'],
    ail: ['yahoo.com'],
    org: 'PSOVI',
    auth: {
      samples: true
    }
  },
  {
    id: 8,
    username: 'naira',
    password: 'd663f408947a01a651c3d54986186764',
    name: 'Naira Tabatadze',
    em: ['naira.tabatadze'],
    ail: ['lma.gov.ge'],
    org: 'LMA Akhaltsikhe',
    auth: {
      diagnostics: true
    }
  },
  {
    id: 9,
    username: 'larisa',
    password: 'd663f408947a01a651c3d54986186764',
    name: 'Larisa Derkach',
    em: ['lar_derkach'],
    ail: ['yahoo.com'],
    org: 'LMA Kutaisi',
    auth: {
      diagnostics: true
    }
  }
];

function findById(id, fn) {
  var idx = id - 1;
  if (users[idx]) {
    fn(null, users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  var i, user;
  for (i = 0; i < users.length; i += 1) {
    user = users[i];
    if (user.username === username) {
      // console.log("middleware/passport/findByUserName(): found username: " + username);
      return fn(null, user);
    }
  }
  return fn(null, null);
}


// Passport session setup.

//   To support persistent login sessions, Passport needs to be able to
//   serialize users into the session and deserialize them out of it.
//   Typically, this will be as simple as storing the user ID when serializing,
//   and finding the user by ID when deserializing.

passport.serializeUser(function (user, done) {
  // console.log('middleware/passport/passport.serializeUser(): User ID ' + user.id + ' in serializeUser, done = '  + done.toString());
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  findById(id, function (err, user) {
    done(err, user);
  });
});


passport.use(new LocalStrategy(function (username, password, done) {
  // Find the user by username.  If there is no user with the given
  // username, or the password is not correct, set the user to `false` to
  // indicate failure and set a flash message.  Otherwise, return the
  // authenticated `user`.
  findByUsername(username, function (err, user) {
    // console.log('middleware/passport/LocalStrategy/findByUsername callback: Trying to authenticate ' + username);
    if (err) {
      return done(err);
    }
    if (!user) {
      // console.log("middleware/passport/findByUserName(): bad username: " + username);
      return done(null, false, {
        message: 'Unknown user ' + username
      });
    }
    if (crypto.createHash('md5').update(password).digest('hex') !== user.password) {
      // console.log("middleware/passport/findByUserName(): bad password: " + password);
      return done(null, false, {
        message: 'Invalid password'
      });
    }
    // console.log('middleware/passport/LocalStrategy/findByUsername():    password OK');
    return done(null, user);
  });
}));

initialize = passport.initialize();

module.exports = function (req, res, next) {
  // we want to take control of the middleware so we can
  // initialize and also attach passport into req object
  initialize(req, res, function (err) {
    if (err) {
      return next(err);
    }

    // attaching passport object into req.passport
    // so this could be used at the controller level
    req.passport = passport;

    // returning control back to mojito flow
    next();
  });
};
