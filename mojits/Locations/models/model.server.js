/*global YUI, console */
/*jslint sloppy: true, nomen: true, indent: 2 */
YUI.add('LocationModel', function (Y, NAME) {

/**
 * The LocationModel module.
 *
 * @module Location
 */

  /**
   * Constructor for the LocationModel class.
   *
   * @class LocationModel
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
        uri = "http://localhost:3030/collections/locations",
        params = {
          q: '{"id": "' + arg.location + '"}'
        },
        rkey = '_resp'; // hide from jslint

      console.log('===== Location model.getData() ======');
      console.log(arg);
      if (arg.location) {
        Y.mojito.lib.REST.GET(uri, params, null, function (err, response) {
          var data;

          console.log(err);
          console.log(response);
          if (err) {
            callback(err);
          }

          data = Y.JSON.parse(response[rkey].responseText).entries[0];
          callback(null, data);
        });
      }
      else {
        callback(null, {
          location: 'no sample selected'
        });
      }
    }
  };
}, '0.0.1', {requires: []});

