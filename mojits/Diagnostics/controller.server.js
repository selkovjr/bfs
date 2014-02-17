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

      console.log("Diagnostics - controller.server.js index called");
      console.log(ac.command.params.body);
      ac.models.get('model').getData(ac.command.params.body, function (err, data) {
        console.log('Diagnostics model called from controller index');

        if (err) {
          ac.error(err);
          return;
        }

        ac.assets.addCss('./index.css');
        if (!data) {
          data = {};
        }
        data.auth = user.auth.diagnostics;
        console.log(data);
        ac.done(data);
      });
    },

    data: function (ac) {
      var model = ac.models.get('model');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
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
          console.error('error condition');
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
          console.error('error condition');
          ac.error(err);
          return;
        }
        ac.done();
      });
    }
  };

}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-assets-addon', 'mojito-models-addon', 'DiagnosticsModel']});
