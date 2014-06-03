YUI.add('addon-ac-pg', function(Y, NAME) {
  var
    pg = require('pg'),
    client;

  function PgAcAddon(command, adapter, ac) {
    // The "command" is the Mojito internal details
    // for the dispatch of the mojit instance.
    // The "adapter" is the output adapter, containing
    // the "done()", "error()", etc, methods.
    // The "ac" is the ActionContext object to which
    // this addon is about to be attached.
    this.user = ac.http.getRequest().user;
    if (this.user && !client) {
      console.log('***** connecting to pg *****');
      client = new pg.Client('postgres://' + this.user + ':@localhost/bfs');
    }
  }

  PgAcAddon.prototype = {
    // The "namespace" is where in the ActionContext
    // the user can find this addon. The namespace
    // must be the same as the first part of the addon file.
    // Thus, this addon file must be named 'pg'.{affinity}.js'
    namespace: 'pg',
    client: function () {
      return client;
    }
  };
  Y.mojito.addons.ac.pg = PgAcAddon;
}, '0.0.1', {requires: ['mojito']});
