/*global YUI, console, require */
/*jslint sloppy: true, nomen: true, indent: 2 */
YUI.add('LocationsModel', function (Y, NAME) {

/**
 * The LocationsModel module.
 *
 * @module LocationsModel
 */

  /**
   * Constructor for the LocationModel class.
   *
   * @class LocationsModel
   * @constructor
   */
  Y.namespace('mojito.models')[NAME] = {
    init: function (config) {
      this.config = config;
      this.pg = require('pg');
      this.pgClient = new this.pg.Client('postgres://postgres:@localhost/bfs');
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
    },

    find: function (arg, callback) {
      var
        query = arg.url.q,
        sql;

      query = query.replace(/'/g, '<apo>').replace(/<apo>/g, "''");

      sql = Y.substitute(
        'SELECT "id", "name", "lat", "long" FROM "locations" WHERE' +
        ' "name" ~* \'{query}\'' +
        ' ORDER BY "name"',
        {query: query}
      );

      this.pgClient.connect(Y.bind(function (err) {
        if (err) {
          return console.error('could not connect to postgres', err);
        }
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            var ac = {};
            if (err) {
              callback(err);
            }
            this.pgClient.end();
            callback(null, result.rows);
          }, this)
        );
      }, this));
    }
  };
}, '0.0.1', {requires: []});

