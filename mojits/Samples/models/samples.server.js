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
  var
    pg,
    user,
    connectionString;

  Y.namespace('mojito.models')[NAME] = {

    init: function (config) {
      this.config = config;
      pg = this.pg;
      user = this.user;
      connectionString = this.connectionString;
    },

    /**
     * Method that will be invoked by the mojit controller to obtain data.
     *
     * @param callback {function(err, data)} The callback function to call when the
     *        data has been retrieved.
     */
    count: function (arg, callback) {
      var sql = 'SELECT count(*) FROM "samples"';

      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          Y.log(err, 'error', NAME + '.count.connect');
          callback(err);
          return;
        }

        console.log(sql);
        client.query(sql, function (err, result) {
          if (err) {
            Y.log(err, 'error', NAME + '.count.query');
            callback(err);
            return;
          }
          done();
          console.log(result);
          callback(null, result.rows[0]);
        });
      });
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
        'selECT * FROM "v_samples_birds_locations" {query} ORDER BY {sort_keys} LIMIT {itemsPerPage} OFFSET {itemIndexStart}',
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
          itemIndexStart: itemIndexStart,
          query: arg.query ? 'WHERE ' + arg.query : ''
        }
      );

      pg.connect(connectionString, function (err, client, done) {
        var countSql;

        if (err) {
          Y.log(err, 'error', NAME + '.getData.connect');
          callback(err);
          return;
        }

        // get totalItems
        countSql = Y.substitute('SELECT count(*) FROM "v_samples_birds_locations"{query}', {
          query: arg.query ? ' WHERE ' + arg.query : ''
        });
        console.log(countSql);
        client.query(countSql, function (err, result) {
          if (err) {
            Y.log(err, 'error', NAME + '.getData.count.query');
            callback(err);
            return;
          }
          totalItems = result.rows[0].count;

          console.log(sql);
          client.query(sql, function (err, result) {
            var notesQuery;

            if (err) {
              Y.log(err, 'error', NAME + '.getData.data.query');
              callback(err);
              return;
            }

            result.paging = {
              itemsPerPage: itemsPerPage,
              itemIndexStart: itemIndexStart,
              totalItems: totalItems
            };
            result.notes = {};

            Y.each(result.rows, function (row) {
              idList.push(row.id);
              Y.each(row, function (v, k) {
                if (v === null) {
                  row[k] = '';
                }
              });
            });

            if (idList.length > 0) {
              notesQuery = 'SELECT * FROM notes WHERE "class" = \'samples\' AND id IN (' + Y.Array.map(idList, function (arg) {
                return "'" + arg + "'";
              }).join(', ') + ')';

              console.log(notesQuery);
              client.query(notesQuery, function (err, notesResult) {
                if (err) {
                  Y.log(err, 'error', NAME + '.getData.notes.query');
                  callback(err);
                  return;
                }

                Y.each(notesResult.rows, function (note) {
                  if (result.notes[note.id] === undefined) {
                    result.notes[note.id] = {};
                  }
                  if (result.notes[note.id][note.attr] === undefined) {
                    result.notes[note.id][note.attr] = [];
                  }
                  result.notes[note.id][note.attr].push({
                    user: note.user,
                    when: note.when,
                    text: note.text
                  });
                });

                done();

                callback(null, result); // result with notes
              });
            }
            else {
              done();
              callback(null, result); // result without notes
            }
          });
        }); // query count
      }); // connect
    }, // getData()

    autocomplete: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          Y.log(err, 'error', NAME + '.autocomplete.connect');
          callback(err);
          return;
        }
        client.query(
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'samples\' ORDER BY "ord"',
          function (err, result) {
            var ac = {};
            done();
            if (err) {
              Y.log(err, 'error', NAME + '.autocomplete.query');
              callback(err);
              return;
            }
            Y.each(result.rows, function (option) {
              if (ac[option.attr] === undefined) {
                ac[option.attr] = [];
              }
              ac[option.attr].push(option.val);
            });
            callback(null, ac);
          }
        );
      });
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

      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          Y.log(err, 'error', NAME + '.bird.connect');
          callback(err);
          return;
        }
        client.query(
          sql,
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.bird.query');
              callback(err);
              return;
            }

            done();
            if (result) {
              callback(null, result.rows);
            }
            else {
              callback(null, {rows: []});
            }
          }
        );
      });
    },

    create: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql = Y.substitute("INSERT INTO samples (id) VALUES ('{id}')", arg);

        if (err) {
          Y.log(err, 'error', NAME + '.create.connect');
          callback(err);
          return;
        }

        console.log(sql);
        client.query(
          sql,
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.create.query');
              callback(err);
              return;
            }

            done();
            console.log('create successful');
            console.log(result);
            callback(null, result);
          }
        );
      });
    },

    'delete': function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql = Y.substitute("DELETE FROM samples WHERE id = '{id}'", arg);

        if (err) {
          Y.log(err, 'error', NAME + '.delete.connect');
          callback(err);
          return;
        }

        console.log(sql);
        client.query(
          sql,
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.delete.query');
              callback(err);
              return;
            }

            done();
            if (result.rowCount) {
              console.log('delete successful');
              callback(null, result);
            } else {
              console.log('update error');
              callback('DELETE: no rows matching "' + arg.id  + '"');
            }
          }
        );
      });
    },

    update: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql;

        if (err) {
          Y.log(err, 'error', NAME + '.update.connect');
          callback(err);
          return;
        }

        if (arg.value !== '' && arg.value !== null && arg.value !== undefined) {
          sql = Y.substitute("UPDATE samples SET {attr} = '{value}' WHERE id = '{id}'", arg);
        } else {
          sql = Y.substitute("UPDATE samples SET {attr} = NULL WHERE id = '{id}'", arg);
        }
        console.log(sql);
        client.query(sql, function (err, result) {
          if (err) {
            Y.log(err, 'error', NAME + '.update.query');
            callback(err);
            return;
          }

          done();
          if (result.rowCount) {
            console.log('update successful');
            callback(null, result);
          } else {
            console.log('update error');
            callback('UPDATE: no rows matching "' + arg.id  + '"');
          }
        });
      });
    },

    findSample: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql;

        if (err) {
          Y.log(err, 'error', NAME + '.findSample.connect');
          callback(err);
          return;
        }

        sql = Y.substitute("SELECT * FROM samples WHERE id = '{id}'", arg);
        client.query(sql, function (err, result) {
          if (err) {
            Y.log(err, 'error', NAME + '.findSample.query');
            callback(err);
            return;
          }

          done();
          callback(null, result);
        });
      });
    },

    addNote: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql = Y.substitute(
          "INSERT INTO notes (\"class\", \"id\", \"attr\", \"user\", \"when\", \"text\") VALUES ('samples', '{id}', '{attr}', '{user}', 'now', $1)",
          {
            id: arg.id,
            attr: arg.attr,
            user: user
          }
        );

        if (err) {
          Y.log(err, 'error', NAME + '.addNote.connect');
          callback(err);
          return;
        }

        console.log(sql);
        console.log("$1 = " + arg.text + "'");
        client.query(
          sql,
          [arg.text],
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.addNote.query');
              callback(err);
              return;
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
}, '0.0.1', {requires: ['mojito', 'json', 'substitute']});
