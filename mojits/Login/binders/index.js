/*global YUI */
/*jslint indent: 2*/
YUI.add('LoginBinderIndex', function (Y, NAME) {

/**
 * The LoginBinderIndex module.
 *
 * @module LoginBinderIndex
 */

  /**
   * Constructor for the LoginBinderIndex class.
   *
   * @class LoginBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {

    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function (mojitProxy) {
      this.mojitProxy = mojitProxy;
    },

    /**
     * The binder method, invoked to allow the mojit to attach DOM event
     * handlers.
     *
     * @param node {Node} The DOM node to which this mojit is attached.
     */
    bind: function (node) {
      Y.on("domready", function () {
        Y.one('#loading-indicator').hide();
        Y.one('#login-form-container').show();
        Y.one('body').on('key', function () {
          Y.one('#login-form').submit();
        }, 'enter');
      });
    }
  };
}, '0.0.1', {requires: ['node', 'event', 'event-key', 'mojito-client']});
