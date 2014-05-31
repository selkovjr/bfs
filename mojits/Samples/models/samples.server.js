/*global YUI, console, require */
/*jslint regexp: true, indent: 2 */
YUI.add('SamplesModel', function (Y, NAME) {
  'use strict';

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
    count: function (arg, callback) {
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
            callback(null, parseInt(result.rows[0].count, 10)); // Pg client stringifies numbers. There is an ongoing discussion about that.
          }
        );
      }, this));
    },

    /**
     * Method that will be invoked by the mojit controller to obtain data.
     *
     * @param callback {function(err,data)} The callback function to call when the
     *        data has been retrieved.
     */
    getData: function (arg, callback) {
      var
        itemIndexStart = arg.itemIndexStart || 0,
        itemsPerPage = arg.itemsPerPage || 3,
        sortKeys = [{'id': 1}],
        sql,
        totalItems,
        idList = [];

      if (typeof arg.sortBy === 'string') {
        sortKeys = Y.JSON.parse(arg.sortBy);
      }
      if (typeof arg.sortBy === 'object') {
        sortKeys = arg.sortBy;
      }

      sql = Y.substitute(
        'SELECT * FROM "v_samples_birds_locations" ORDER BY {sort_keys} LIMIT {itemsPerPage} OFFSET {itemIndexStart}',
        {
          sort_keys: Y.Array.map(sortKeys, function (k) {
            var key, order;
            if (typeof k === 'string') {
              key = k;
              order = 'ASC';
            } else {
              key = Object.keys(k)[0];
              order = k[key] > 0 ? 'ASC' : 'DESC';
            }
            return '"' + key + '" ' + order;
          }).join(', '),
          itemsPerPage: itemsPerPage,
          itemIndexStart: itemIndexStart
        }
      );

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
            totalItems = parseInt(result.rows[0].count, 10); // Pg client stringifies numbers. There is an ongoing discussion about that.
          }
        );

        console.log(sql);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            var notesQuery;

            if (err) {
              callback(err);
            }

            result.paging = {
              itemsPerPage: itemsPerPage,
              itemIndexStart: itemIndexStart,
              totalItems: totalItems
            };
            // find out about the use of node pg parsers for this
            Y.each(result.rows, function (row) {
              idList.push(row.id);
              row.date = Y.DataType.Date.format(row.date, {format: "%Y-%m-%d"});
              Y.each(row, function (v, k) {
                if (v === null) {
                  row[k] = '';
                }
              });
            });

            notesQuery = 'SELECT * FROM notes WHERE "class" = \'samples\' AND id IN (' + Y.Array.map(idList, function (arg) {
              return "'" + arg + "'";
            }).join(', ') + ')';

            console.log(notesQuery);
            this.pgClient.query(
              notesQuery,
              function (err, notesResult) {
                if (err) {
                  callback(err);
                }
                result.notes = {};
                Y.each(notesResult.rows, function (note) {
                  result.notes[note.id] = {
                    attr: note.attr,
                    user: note.user,
                    when: note.when,
                    text: note.text
                  };
                });
                callback(null, result);
              }
            );
            this.pgClient.end();
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
            this.pgClient.end();
            if (err) {
              callback(err);
            }
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
          callback('could not connect to postgres; ' + err);
        }
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            this.pgClient.end();
            if (err) {
              callback(err);
            }
            if (result) {
              callback(null, result.rows);
            }
            else {
              callback(null, {rows: []});
            }
          }, this)
        );
      }, this));
    },

    create: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql = Y.substitute("INSERT INTO samples (id) VALUES ('{id}')", arg);

        if (err) {
          return console.error('could not connect to postgres', err);
        }

        console.log(sql);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            this.pgClient.end();
            if (err) {
              callback(err);
            }
            console.log('create successful');
            console.log(result);
            callback(null, result);
          }, this)
        );
      }, this));
    },

    'delete': function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql = Y.substitute("DELETE FROM samples WHERE id = '{id}'", arg);

        if (err) {
          return console.error('could not connect to postgres', err);
        }

        console.log(sql);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            this.pgClient.end();
            if (err) {
              callback(err);
            }
            else {
              if (result.rowCount) {
                console.log('delete successful');
                callback(null, result);
              } else {
                console.log('update error');
                callback('DELETE: no rows matching "' + arg.id  + '"');
              }
            }
          }, this)
        );
      }, this));
    },

    update: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql;

        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }

        if (arg.value !== '' && arg.value !== null && arg.value !== undefined) {
          sql = Y.substitute("UPDATE samples SET {attr} = '{value}' WHERE id = '{id}'", arg);
        } else {
          sql = Y.substitute("UPDATE samples SET {attr} = NULL WHERE id = '{id}'", arg);
        }
        console.log(sql);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            console.log('-------- update query --------');
            console.log([err, result]);
            this.pgClient.end();
            if (err) {
              callback(err);
            }
            else {
              if (result.rowCount) {
                console.log('update successful');
                callback(null, result);
              } else {
                console.log('update error');
                callback('UPDATE: no rows matching "' + arg.id  + '"');
              }
            }
          }, this)
        );
      }, this));
    },

    find: function (arg, callback) {
      this.pgClient.connect(Y.bind(function (err) {
        var sql;

        if (err) {
          console.error('could not connect to postgres', err);
          callback(err);
        }

        sql = Y.substitute("SELECT * FROM samples WHERE id = '{id}'", arg);
        this.pgClient.query(
          sql,
          Y.bind(function (err, result) {
            console.log('-------- find query --------');
            console.log([err, result]);
            this.pgClient.end();
            if (err) {
              callback(err);
            }
            callback(null, result);
          }, this)
        );
      }, this));
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-rest-lib', 'json', 'substitute']});
