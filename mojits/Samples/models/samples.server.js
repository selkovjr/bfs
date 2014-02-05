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
    },

    autocomplete: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        this.pgClient.query(
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'samples\' ORDER BY "ord"',
          Y.bind(function(err, result) {
            var ac = {};
            if(err) {
              return console.error('error running autocomplete query', err);
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
        if(err) {
          return console.error('could not connect to postgres', err);
        }
        this.pgClient.query(
          Y.substitute("UPDATE samples SET {attr} = '{value}' WHERE id = '{id}'", arg),
          Y.bind(function(err, result) {
            if(err) {
              return console.error('error running update query', err);
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
