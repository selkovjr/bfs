/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('DiagnosticsBinderIndex', function(Y, NAME) {
/**
 * The DiagnosticsBinderIndex module.
 *
 * @module DiagnosticsBinderIndex
 */

  /**
   * Constructor for the DiagnosticsBinderIndex class.
   *
   * @class DiagnosticsBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {
    init: function(mojitProxy) {
      this.mojitProxy = mojitProxy;
    },

    /**
     * The binder method, invoked to allow the mojit to attach DOM event
     * handlers.
     *
     * @param node {Node} The DOM node to which this mojit is attached.
     */
    bind: function(node) {
      var me = this;
      this.node = node;

      this.mojitProxy.listen('row-selected', function (e) {
        Y.log('broadcast event received in Diagnostics', 'info', NAME);
        node.one('#diagnostics-sample-id').setContent(e.data.row.record.get('id'));
        if (me.node.one('#diagnostics').hasClass('collapse')) {
          me.node.one('#diagnostics').removeClass('collapse');
        }
      });
    }

  };

}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
