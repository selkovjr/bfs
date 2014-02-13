/*global YUI, console */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Locations', function(Y, NAME) {

/**
 * The Locations module.
 *
 * @module Locations
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
    index: function (ac) {
      console.log('Locations index');
      console.log(ac.command.params);
      ac.models.get('model').getData(ac.command.params.body, function (err, data) {
        if (err) {
          ac.error(err);
          return;
        }
        ac.assets.addCss('./index.css');
        ac.done(data);
      });
    },

    find: function (ac) {
      ac.models.get('model').find(ac.command.params, function (err, data) {
        if (err) {
          ac.error(err);
          return;
        }
        ac.done(data, 'json');
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon']});
