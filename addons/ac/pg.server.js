YUI.add('addon-ac-pg', function(Y, NAME) {
  var
    pg = require('pg');

  function PgAcAddon(command, adapter, ac) {
    // This function gets called on each request.
    //
    // The "command" is the Mojito internal details
    // for the dispatch of the mojit instance.
    // The "adapter" is the output adapter, containing
    // the "done()", "error()", etc, methods.
    // The "ac" is the ActionContext object to which
    // this addon is about to be attached.
  }

  PgAcAddon.prototype = {
    // The "namespace" is where in the ActionContext
    // the user can find this addon. The namespace
    // must be the same as the first part of the addon file.
    // Thus, this addon file must be named 'pg'.{affinity}.js'

    namespace: 'pg',

    module: function () {
      return pg;
    }
  };

  Y.mojito.addons.ac.pg = PgAcAddon;
}, '0.0.1', {requires: ['mojito']});
