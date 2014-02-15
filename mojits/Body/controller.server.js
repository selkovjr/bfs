YUI.add('Body', function(Y, NAME) {

  /**
  * The Body module.
  *
  * This mojit has no model as it only serves as a container for other
  * mojits.
  *
  * @module Body
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
    * to the Mojito API.
    */
    index: function (ac) {
      ac.assets.addCss('./index.css');
      ac.composite.done({
        title: "Body title"
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-composite-addon']});
