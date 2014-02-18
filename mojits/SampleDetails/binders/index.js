/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('SampleDetailsBinderIndex', function(Y, NAME) {
/**
 * The SampleDetailsBinderIndex module.
 *
 * @module SampleDetailsBinderIndex
 */

  /**
   * Constructor for the SampleDetailsBinderIndex class.
   *
   * @class SampleDetailsBinderIndex
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
        Y.log('broadcast event received in SampleDetails', 'info', NAME);

        if (node.one('#sample-details').hasClass('collapse')) {
          node.one('#sample-details').removeClass('collapse');
        }

        node.one('#sample-details-message').setContent('Loading data...');

        console.log('refresh view');
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
