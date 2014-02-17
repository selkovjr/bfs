/*global YUI, console */
/*jslint sloppy: true, nomen: true, indent: 2 */
YUI.add('DiagnosticsModel', function (Y, NAME) {

/**
 * The DiagnosticsModel module.
 *
 * @module Diagnostics
 */

  /**
   * Constructor for the DiagnosticsModel class.
   *
   * @class DiagnosticsModel
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
        sql;

      sql = Y.substitute(
        'SELECT * FROM "diagnostics" WHERE "sample" = \'{query}\'',
        {query: arg.id}
      );

      this.pgClient.connect(Y.bind(function (err) {
        if (err) {
          return console.error('could not connect to postgres', err);
        }
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            var data = result.rows[0];

            this.pgClient.end();
            if (err) {
              callback(err);
            }

            Y.each(data, function (v, k) {
              if (v === null) {
                data[k] = '';
              }
              else if (k === 'date' || k === 'rec_date') {
                data[k] = Y.DataType.Date.format(data[k], {format: "%Y-%m-%d"});
              }
            });

            callback(null, result.rows[0]);
          }, this)
        );
      }, this));
    }

  };
}, '0.0.1', {requires: []});

