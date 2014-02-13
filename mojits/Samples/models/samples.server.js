/*global YUI, console, require */
/*jslint sloppy:true, nomen:true, indent:2*/
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
      console.log(['getData()', arg]);
      var
        itemIndexStart = arg.sk || 0,
        itemsPerPage = arg.l || 30,
        sortKeys = [{'id': 1}],
        sql,
        totalItems;

      if (arg.s) {
        if (typeof arg.s === 'string') {
          sortKeys = Y.JSON.parse(arg.sortBy);
        }
        if (typeof arg.sortBy === 'object') {
          sortKeys = arg.sortBy;
        }
      }

      sql = Y.substitute(
        'SELECT * FROM "v_samples_birds_locations" ORDER BY {sort_keys} LIMIT {itemsPerPage} OFFSET {itemIndexStart}',
        {
          sort_keys: Y.Array.map(sortKeys, function (k) {
            var key, order;
            if (typeof k === 'string') {
              key = k;
              order = 'ASC';
            }
            else {
              key = Object.keys(k)[0];
              order = k[key] > 0 ? 'ASC' : 'DESC';
            }
            return '"' + key + '" ' + order;
          }).join(', '),
          itemsPerPage: itemsPerPage,
          itemIndexStart: itemIndexStart
        }
      );
      console.log(sql);

      this.pgClient.connect(Y.bind(function (err) {
        if (err) {
          callback(err);
        }
        this.pgClient.query(
          'SELECT count(*) FROM "samples"',
          function (err, result) {
            if (err) {
              callback(err);
            }
            totalItems = parseInt(result.rows[0].count, 10); // why does it come as a string?
          }
        );
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            this.pgClient.end();

            var ac = {};
            if (err) {
              callback(err);
            }

            // delete result.fields; // to reduce traffic
            // result.pageOffset = itemIndexStart;

            // result.page =  Math.floor(itemIndexStart / itemsPerPage);
            // result.totalItems = totalItems;
            // result.itemsPerPage = itemsPerPage;
            // result.itemIndexStart =  itemIndexStart;
            // result.itemIndexEnd = Math.min(totalItems, itemIndexStart + itemsPerPage) - 1;

            result.entries = result.rows;
            result.paging = {
              l: itemsPerPage,
              sk: itemIndexStart,
              count: totalItems
            };
            // find out about the use of node pg parsers for this
            Y.each(result.rows, function (row) {
              row.date = Y.DataType.Date.format(row.date, {format: "%Y-%m-%d"});
              Y.each(row, function (v, k) {
                if (v === null) {
                  row[k] = '';
                }
              });
            });

            callback(null, result);
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
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'samples\' ORDER BY "ord"',
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

    bird: function (arg, callback) {
      var
        query = arg.q,
        sql;

      query = query.replace(/'/g, '<apo>').replace(/<apo>/g, "''");

      sql = Y.substitute(
        'SELECT "id", "name", "common_name" FROM "birds" WHERE' +
        ' "name" ~* \'{query}\'' +
        ' OR "common_name" ~* \'{query}\'' +
        ' ORDER BY "common_name"',
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
    },

    location: function (arg, callback) {
      var
        query = arg.q,
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
    },

    update: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql;

        if (err) {
          return console.error('could not connect to postgres', err);
        }

        if (arg.value !== '' && arg.value !== null && arg.value !== undefined) {
          sql = Y.substitute("UPDATE samples SET {attr} = '{value}' WHERE id = '{id}'", arg);
        }
        else {
          sql = Y.substitute("UPDATE samples SET {attr} = NULL WHERE id = '{id}'", arg);
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
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-rest-lib', 'json', 'substitute']});
