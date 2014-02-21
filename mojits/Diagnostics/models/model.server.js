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
      var user = Y.namespace('mojito.models')[NAME].user || 'postgres';
      this.config = config;
      this.pg = require('pg');
      this.pgClient = new this.pg.Client('postgres://' + user + ':@localhost/bfs');
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
    },

    autocomplete: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        if (err) {
          return console.error('could not connect to postgres', err);
        }
        this.pgClient.query(
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'diagnostics\' ORDER BY "ord"',
          Y.bind(function (err, result) {
            var ac = {};
            if (err) {
              callback(err);
            }
            this.pgClient.end();
            Y.each(result.rows, function (option) {
              if (ac[option.attr] === undefined) {
                ac[option.attr] = [];
              }
              // ac[option.attr].push({val: option.val, desc: option.desc});
              ac[option.attr].push(option.val);
            });
            callback(null, ac);
          }, this)
        );
      }, this));
    },

    update: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql;

        if (err) {
          return console.error('could not connect to postgres', err);
        }

        if (arg.value !== '' && arg.value !== null && arg.value !== undefined) {
          sql = Y.substitute("UPDATE diagnostics SET {attr} = '{value}' WHERE sample = '{id}'", arg);
        } else {
          sql = Y.substitute("UPDATE diagnostics SET {attr} = NULL WHERE sample = '{id}'", arg);
        }
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            if (err) {
              callback(err);
            }
            console.log('update successful');
            console.log(result);
            this.pgClient.end();
            callback(null, result);
          }, this)
        );
      }, this));
    },

    create: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql = Y.substitute("INSERT into diagnostics (sample) VALUES ('{id}')", arg);

        if (err) {
          return console.error('could not connect to postgres', err);
        }

        console.log(sql);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            if (err) {
              callback(err);
            }
            console.log('create successful');
            console.log(result);
            this.pgClient.end();
            callback(null, result);
          }, this)
        );
      }, this));
    }
  };
}, '0.0.1', {requires: []});

