/*global YUI, console */
/*jslint indent: 2 */
YUI.add('Header', function (Y, NAME) {
  'use strict';
  /**
  * The Header module.
  *
  * This mojit does not have a model. It gets its data from the HTTP request.
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
    index: function (ac) {
      var user = ac.http.getRequest().user;
      ac.assets.addCss('./index.css');
      if (user) {
        ac.done({
          name: user.name,
          id: user.username
        });
      } else {
        ac.done({
          title: "Header title"
        });
      }
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-assets-addon']});
