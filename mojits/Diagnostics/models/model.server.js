/*global YUI */
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
    getData: function (arg, callback) {
      Y.log(arg, 'warn', NAME + '.getData');
      var
        sql;

      sql = Y.substitute(
        'SELECT * FROM "diagnostics" WHERE "sample" = \'{query}\'',
        {query: arg.id}
      );

      pg.connect(connectionString, function (err, client, done) {
        if (err) {
          Y.log(err, 'error', NAME + '.getData.connect');
          callback(err);
          return;
        }
        Y.log(sql, 'warn', NAME + '.getData');
        client.query(sql, function (err, result) {
          var
            data,
            notesQuery;

          if (err) {
            Y.log(err, 'error', NAME + '.getData.data.query');
            callback(err);
            return;
          }

          data = result.rows[0];
          Y.each(data, function (v, k) {
            if (v === null) {
              data[k] = '';
            }
            else if (k === 'date' || k === 'rec_date') {
              data[k] = Y.DataType.Date.format(data[k], {format: "%Y-%m-%d"});
            }
          });

          notesQuery = 'SELECT * FROM notes WHERE "class" = \'diagnostics\' AND id = \'' + arg.id + '\'';

          Y.log(notesQuery, 'warn', NAME + '.getData');
          client.query(notesQuery, function (err, notesResult) {
            if (err) {
              Y.log(err, 'error', NAME + '.getData.notes.query');
              callback(err);
              return;
            }
            result.notes = {};
            Y.each(notesResult.rows, function (note) {
              if (result.notes[note.attr] === undefined) {
                result.notes[note.attr] = [];
              }
              result.notes[note.attr].push({
                user: note.user,
                when: note.when,
                text: note.text
              });
            });

            done();
            callback(null, result);
          });
        }); // diagnostics-by-sample query
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
          'SELECT "attr", "val", "desc" FROM "ac" WHERE "class" = \'diagnostics\' ORDER BY "ord"',
          function (err, result) {
            var ac = {};

            if (err) {
              Y.log(err, 'error', NAME + '.autocomplete.query');
              callback(err);
              return;
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
          Y.log(err, 'error', NAME + '.update.connect');
          callback(err);
          return;
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
              Y.log(err, 'error', NAME + '.update.query');
              callback(err);
              return;
            }
            done();
            Y.log('update successful');
            Y.log(result);
            callback(null, result);
          }
        );
      });
    },

    create: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        var sql = Y.substitute("INSERT into diagnostics (sample) VALUES ('{id}')", arg);

        if (err) {
          Y.log(err, 'error', NAME + '.create.connect');
          callback(err);
          return;
        }

        Y.log(sql);
        client.query(
          sql,
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.create.query');
              callback(err);
              return;
            }
            done();
            Y.log('create successful');
            Y.log(result);
            callback(null, result);
          }
        );
      });
    },

    addNote: function (arg, callback) {
      pg.connect(connectionString, function (err, client, done) {
        Y.log(arg);
        var sql = Y.substitute(
          "INSERT INTO notes (\"class\", \"id\", \"attr\", \"user\", \"when\", \"text\") VALUES ('diagnostics', '{id}', '{attr}', '{user}', 'now', $1)",
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

        Y.log(sql);
        Y.log("$1 = " + arg.text + "'");
        client.query(
          sql,
          [arg.text],
          function (err, result) {
            if (err) {
              Y.log(err, 'error', NAME + '.addNote.connect');
              callback(err);
              return;
            }

            done();
            Y.log('create successful');
            Y.log(result);
            callback(null, result);
          }
        );
      });
    }
  };
}, '0.0.1', {requires: []});

