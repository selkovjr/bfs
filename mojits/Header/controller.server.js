/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Header', function(Y, NAME) {

  /**
  * The Header module.
  *
  * @module Header
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
      if (user) {
        ac.done({
          title: 'user: ' + user.username
        });
      }
      else {
        ac.done({
          title: "Header title"
        });
      }
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon']});
