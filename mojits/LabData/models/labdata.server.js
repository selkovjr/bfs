/*global YUI, console*/
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('LabDataModel', function(Y, NAME) {

/**
 * The LabDataModel module.
 *
 * @module LabData
 */

  /**
   * Constructor for the LabDataModel class.
   *
   * @class LabDataModel
   * @constructor
   */
  Y.namespace('mojito.models')[NAME] = {
    init: function(config) {
      this.config = config;
    },

    /**
     * Method that will be invoked by the mojit controller to obtain data.
     *
     * @param callback {function(err,data)} The callback function to call when the
     *        data has been retrieved.
     */
    getData: function(arg, callback) {
      // var
      //   // uri = "http://localhost:3030/collections/samples",
      //   uri = "http://localhost:3030/collections/diagnostics",
      //   params = {
      //     q: '{"id": ' + arg.id + '}'
      //   },
      //   rkey = '_resp'; // hide from jslint

      // Y.mojito.lib.REST.GET(uri, params, null, function (err, response) {
      //   if (err) {
      //     callback(err);
      //   }
      //   callback(null, Y.JSON.parse(response[rkey].responseText));
      // });

      callback(null, {
        id: arg.id
      });
    }
  };
}, '0.0.1', {requires: []});

