YUI.add('Footer', function(Y, NAME) {

  /**
  * The Footer module.
  *
  * @module Footer
  */
  /**
  * Constructor for the Controller class.
  *
  * @class Controller
  * @constructor
  */
  function Shell(cmd, args, options, cb_stdout, cb_end) {
    var
    spawn = require('child_process').spawn,
    child = spawn(cmd, args, options),
    me = this;

    me.exit = 0;  // Send a cb to set 1 when cmd exits
    me.stdout = '';

    child.stdout.on('data', function (data) {
      cb_stdout(me, data);
    });

    child.stdout.on('end', function () {
      cb_end(me);
    });
  }

  Y.namespace('mojito.controllers')[NAME] = {
    /**
    * Method corresponding to the 'index' action.
    *
    * @param ac {Object} The ActionContext that provides access
    * to the Mojito API.
    */
    index: function(ac) {
      var shell;

      shell = new Shell(
        'git', ['log', '-1', '--format=%cd / %ce / %s'],
        {
          cwd: '/home/bfs/src/bfs'
        },
        //'date', ['-u'],
        function (me, data) {
          me.stdout += data.toString();
        },
        function (me) {
          me.exit = 1;
        }
      );

      function report() {
        ac.done({
          date: shell.stdout
        });
      }

      setTimeout(report, 250);
    }
  };
}, '0.0.1', {requires: ['mojito']});
