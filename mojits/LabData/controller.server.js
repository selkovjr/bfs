/*global YUI, console*/
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('LabData', function(Y, NAME) {

/**
 * The LabData module.
 *
 * @module LabData
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
      console.log("LabData - controller.server.js index called");
      console.log(ac.command.params.body);
      ac.models.get('labdata').getData(ac.command.params.body, function (err, data) {
        console.log('LabData model called from controller index');
        console.log(data);
        if (err) {
          ac.error(err);
          return;
        }
        ac.assets.addCss('./index.css');
        ac.done(data);
      });
    }

  };

}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-models-addon', 'LabDataModel']});
