/*global YUI: false, console: false */
/*jslint anon:true, sloppy:true, nomen:true */
YUI.add('LocationsBinderIndex', function(Y, NAME) {
/**
 * The LocationBinderIndex module.
 *
 * @module LocationsBinderIndex
 */

  /**
   * Constructor for the LocationBinderIndex class.
   *
   * @class LocationsBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {

    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function (mojitProxy) {
      Y.log('******** Locations binder index.js init()');
      this.mojitProxy = mojitProxy;
    },

    /**
     * The binder method, invoked to allow the mojit to attach DOM event
     * handlers.
     *
     * @param node {Node} The DOM node to which this mojit is attached.
     */
    // bind: function(node) {
    //   Y.log('-------- bind ---------');
    //   var me = this;
    //   this.node = node;

    //   this.mojitProxy.listen('row-selected', Y.bind (function(e) {
    //     Y.log('broadcast event received', 'info', NAME);
    //     Y.log(e.data.row.record.get('location'));

    //     node.one('#location').setContent('getting data ...');
    //     this.mojitProxy.refreshView({
    //       params: {
    //         body: {
    //           location: e.data.row.record.get('location')
    //         }
    //       },
    //       rpc: true
    //     });
    //   }, this));
    // }
  };
}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
