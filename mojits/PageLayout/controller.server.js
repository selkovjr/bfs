YUI.add('PageLayout', function(Y, NAME) {

  /**
  * The PageLayout module.
  *
  * @module PageLayout
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
      if (ac.params.getFromMerged('view_type') === 'login') {
        ac.done({
          title: "Log in"
        }, 'login');
      }
      else {
        ac.composite.done({
          title: "PageLayout title"
        });
      }
    }
  };
}, '0.0.1', {requires: ['mojito','mojito-composite-addon', 'mojito-params-addon']});
