/*global YUI: false, console: false */
/*jslint anon:true, sloppy:true, nomen:true */
YUI.add('LabDataBinderIndex', function(Y, NAME) {
/**
 * The LabDataBinderIndex module.
 *
 * @module LabDataBinderIndex
 */

  /**
   * Constructor for the LabDataBinderIndex class.
   *
   * @class LabDataBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {

    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function(mojitProxy) {
      Y.log('******** LabData binder index.js init()');
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

    //   this.mojitProxy.listen('row-selected', Y.bind(function(e) {
    //     Y.log('broadcast event received', 'info', NAME);
    //     Y.log(e);

    //     node.one('#diagnostics').setContent('getting data ...');
    //     this.mojitProxy.refreshView({
    //       params: {
    //         body: {
    //           id: e.data.row.record.get('id'),
    //           row: 132
    //         }
    //       },
    //       rpc: true
    //     });
    //   }, this));
    // }
  };
}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
