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
  var
    pg,
    connectionString;

  Y.namespace('mojito.models')[NAME] = {
    init: function (config) {
      this.config = config;
      pg = this.pg;
      connectionString = this.connectionString;
    },

    /**
     * Method that will be invoked by the mojit controller to obtain data.
     *
     * @param callback {function(err,data)} The callback function to call when the
     *        data has been retrieved.
     */
    getData: function (arg, callback) {
      var
        sql;

      if (arg.location) {
        sql = Y.substitute(
          'SELECT * FROM "locations" WHERE' +
          ' "id" = \'{query}\'',
          {query: arg.location}
        );

        pg.connect(connectionString, function (err, client, done) {
          if (err) {
            console.error('could not connect to postgres', err);
            callback(err);
          }

          client.query(
            sql,
            function (err, result) {
              var ac = {};
              if (err) {
                callback(err);
              }
              done();
              callback(null, result.rows[0]);
            }
          );
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

      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }
        client.query(
          sql,
          function (err, result) {
            var ac = {};
            if (err) {
              callback(err);
            }
            done();
            callback(null, result.rows);
          }
        );
      });
    }
  };
}, '0.0.1', {requires: []});

