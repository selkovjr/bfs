/*global YUI */
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('SampleDetails', function(Y, NAME) {

/**
 * The SampleDetails module.
 *
 * @module SampleDetails
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
      ac.assets.addCss('./index.css');
      ac.composite.done({
        id: ac.params.getFromMerged('id')
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-assets-addon', 'mojito-composite-addon', 'mojito-params-addon']});
