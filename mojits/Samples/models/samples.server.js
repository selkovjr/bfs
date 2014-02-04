/*global YUI, console */
/*jslint anon:true, sloppy:true, nomen:true, indent:2*/
YUI.add('SamplesModel', function (Y, NAME) {

  /**
   * The SamplesModel module.
   *
   * @module Samples
   */

  /**
   * Constructor for the SamplesModel class.
   *
   * @class SamplesModel
   * @constructor
   */
  Y.namespace('mojito.models')[NAME] = {

    init: function (config) {
      this.config = config;
    },

    /**
     * Method that will be invoked by the mojit controller to obtain data.
     *
     * @param callback {function(err,data)} The callback function to call when the
     *        data has been retrieved.
     */
    getData: function (arg, callback) {
      var
        filteredResponse,
        // uri = "http://localhost:3030/collections/samples",
        uri = "http://localhost:3030/collections/v_samples_birds_cn",
        params = {
          // q: '{"id":{"$matches":"217-..?$"}}',
          sk: arg.sk || 0,
          // s: '{"date": 1, "type": -1}',
          l: arg.l || 30
        },
        rkey = '_resp'; // hide from jslint

      if (arg.s) {
        params.s = arg.s;
      }

      Y.mojito.lib.REST.GET(uri, params, null, function (err, response) {
        if (err) {
          callback(err);
        }
        filteredResponse = response[rkey].responseText.replace(/T00:00:00\.000Z/g, '');
        callback(null, Y.JSON.parse(filteredResponse));
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-rest-lib', 'json']});
