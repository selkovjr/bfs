/*global YUI, console*/
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Diagnostics', function(Y, NAME) {

/**
 * The Diagnostics module.
 *
 * @module Diagnostics
 */

  /**
   * Constructor for the Controller class.
   *
   * @class Controller
   * @constructor
   */
  Y.namespace('mojito.controllers')[NAME] = {

    /**
     * Method corresponding to the 'index' action.
     *
     * @param ac {Object} The ActionContext that provides access
     *        to the Mojito API.
     */
    index: function(ac) {
      var user = ac.http.getRequest().user;

      if (ac.command.params.body.id === undefined) {
        ac.done();
      }
      else {
        Y.log(ac.command.params.body, 'info', NAME + '.controller.index');
        if (user.auth.diagnostics) {
          // Don't render HTML for authorised users; their DataTable will fetch data
          ac.assets.addCss('./index.css');
          ac.done({
            auth: user.auth.diagnostics
          });
        }
        else {
          ac.models.get('model').getData(ac.command.params.body, function (err, data) {
            Y.log('getData callback (1)', 'info', NAME + '.controller.index');

            if (err) {
              Y.log('error condition', 'error', NAME + '.controller.index');
              ac.error(err);
              return;
            }

            ac.assets.addCss('./index.css');
            if (!data) {
              data = {};
            }
            data.auth = user.auth.diagnostics;
            data.sample = (data.rows && data.rows[0]) ? data.rows[0].sample : undefined; // to make it easier on the template
            ac.done(data);
          });
        }
      }
    },

    data: function (ac) {
      var model = ac.models.get('model');
      Y.log(['data', ac.command.params.body], 'info', NAME + '.controller.data');
      model.getData(ac.command.params.body, function (err, data) {
        Y.log('getData callback (2)', 'info', NAME + '.controller.data');
        if (err) {
          Y.log('error condition', 'error', NAME + '.controller.data');
          ac.error(err);
          return;
        }
        ac.done(data, 'json');
      });
    },

    autocomplete: function (ac) {
      var model = ac.models.get('model');
      model.autocomplete(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.controller' + '.autocomplete');
          ac.error(err);
          return;
        }
        ac.done(Y.JSON.stringify(data), 'json');
      });
    },

    update: function (ac) {
      var model = ac.models.get('model');
      model.update(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.controller' + '.update');
          ac.error(err);
          return;
        }
        ac.done();
      });
    },

    create: function (ac) {
      var model = ac.models.get('model');
      model.create(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.controller' + '.create');
          ac.error(err);
          return;
        }
        ac.done();
      });
    },

    addNote: function (ac) {
      var model = ac.models.get('model');
      model.addNote(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.controller' + '.addNote');
          ac.error(err);
          return;
        }
        ac.done();
      });
    }
  };

}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-params-addon', 'mojito-assets-addon', 'mojito-models-addon', 'DiagnosticsModel']});
