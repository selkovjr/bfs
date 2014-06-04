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
      console.log(['getData', arg]);
      var
        sql;

      sql = Y.substitute(
        'SELECT * FROM "diagnostics" WHERE "sample" = \'{query}\'',
        {query: arg.id}
      );

      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }
        client.query(
          sql,
          function (err, result) {
            var data;

            if (err) {
              callback(err);
            }

            done();
            data = result.rows[0];
            Y.each(data, function (v, k) {
              if (v === null) {
                data[k] = '';
              }
              else if (k === 'date' || k === 'rec_date') {
                data[k] = Y.DataType.Date.format(data[k], {format: "%Y-%m-%d"});
              }
            });

            callback(null, result.rows[0]);
          }
        );
      });
    },

    autocomplete: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }
        client.query(
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'diagnostics\' ORDER BY "ord"',
          function (err, result) {
            var ac = {};

            if (err) {
              callback(err);
            }

            done();
            Y.each(result.rows, function (option) {
              if (ac[option.attr] === undefined) {
                ac[option.attr] = [];
              }
              // ac[option.attr].push({val: option.val, desc: option.desc});
              ac[option.attr].push(option.val);
            });
            callback(null, ac);
          }
        );
      });
    },

    update: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql;

        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }

        if (arg.value !== '' && arg.value !== null && arg.value !== undefined) {
          sql = Y.substitute("UPDATE diagnostics SET {attr} = '{value}' WHERE sample = '{id}'", arg);
        } else {
          sql = Y.substitute("UPDATE diagnostics SET {attr} = NULL WHERE sample = '{id}'", arg);
        }
        client.query(
          sql,
          function (err, result) {
            if (err) {
              callback(err);
            }
            done();
            console.log('update successful');
            console.log(result);
            callback(null, result);
          }
        );
      });
    },

    create: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql = Y.substitute("INSERT into diagnostics (sample) VALUES ('{id}')", arg);

        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }

        console.log(sql);
        client.query(
          sql,
          function (err, result) {
            if (err) {
              callback(err);
            }
            done();
            console.log('create successful');
            console.log(result);
            callback(null, result);
          }
        );
      });
    }
  };
}, '0.0.1', {requires: []});

