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
      this.mojitProxy.listen('row-selected', Y.bind(function (e) {
        Y.log('broadcast event received in Diagnostics', 'info', NAME);

        if (node.one('#diagnostics').hasClass('collapse')) {
          node.one('#diagnostics').removeClass('collapse');
        }

        node.one('#diagnostics-message').setContent('Loading data...');

        this.mojitProxy.refreshView({
          params: {
            body: {
              id: e.data.row.record.get('id'),
              location: e.data.row.record.get('location')
            }
          },
          rpc: true
        });
      }, this));
    }

  };

}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
