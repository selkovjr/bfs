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
        totalItems,
        filteredResponse,
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
        if (typeof arg.s === 'string') {
          sortKeys = Y.JSON.parse(arg.sortBy);
        }
        if (typeof arg.sortBy === 'object') {
          sortKeys = arg.sortBy;
        }
      }

      sql = Y.substitute(
        'SELECT * FROM "v_samples_birds_cn" ORDER BY {sort_keys} LIMIT {itemsPerPage} OFFSET {itemIndexStart}',
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

      Y.mojito.lib.REST.GET(uri, params, null, function (err, response) {
        if (err) {
          callback(err);
        }
        filteredResponse = Y.JSON.parse(response[rkey].responseText.replace(/T00:00:00\.000Z/g, ''));
        console.log(filteredResponse);
        Y.each(filteredResponse.entries, function(e) {
          Y.each(e, function (v, k) {
            if (v === null) {
              e[k] = '';
            }
          });
        });
        callback(null, filteredResponse);
      });
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
