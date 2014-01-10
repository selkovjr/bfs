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
      this.mojitProxy = mojitProxy;
    },

    /**
     * The binder method, invoked to allow the mojit to attach DOM event
     * handlers.
     *
     * @param node {Node} The DOM node to which this mojit is attached.
     */
    bind: function(node) {
      Y.log('-------- bind ---------');
      Y.log(node);
      var me = this;
      this.node = node;

      this.mojitProxy.listen('row-selected', Y.bind(function(payload) {
        var
          urlParams = Y.mojito.util.copy(this.mojitProxy.context),
          routeParams,
          options = {
            params: {
              body: {
                id: 'record id'
              }
            }
          };

        Y.log('broadcast event received', 'info', NAME);
        Y.log(payload);

        routeParams = {
          row: payload.data.row
        };
        this.mojitProxy.invoke('index', options, function (err, data) {
          if (err) {
            console.log('server transaction error: ' + err);
          }
          else {
            node.replace(data);
          }
        });
        // mojitProxy.refreshView({
        //   params: {
        //     url: urlParams,
        //     route: routeParams
        //   }
        // });
      }, this));
    }
  };
}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
