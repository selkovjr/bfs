/*global YUI, console */
/*jslint indent: 2 */
YUI.add('Samples', function (Y, NAME) {
  'use strict';

  Y.namespace('mojito.controllers')[NAME] = {
    index: function (ac) {
      var
        model,
        user = ac.http.getRequest().user;

      if (user) {
        // Using the index action as a sort of initialize() method
        // to attach common properties to all models.
        Y.each(Y.namespace('mojito.models'), function (model) {
          model.user = user.username;
          model.pg = ac.pg.module();
          model.connectionString = ac.pg.connectionString();
        });

        model = ac.models.get('samples');
        model.count(null, function (err, data) {
          if (err) {
            Y.log('error condition', 'error', NAME + '.index');
            ac.error(err); // The error is logged in the model
          }
          else {
            ac.assets.addCss('./index.css');
            ac.done({
              title: "Samples",
              nsamples: data.count,
              auth: user.auth.samples
            });
          }
        });
      }
      else {
        Y.log('undefined user', 'err', NAME + '.index');
        // ac.error({});
        ac.error('undefined user');
      }
    },

    data: function (ac) {
      var model = ac.models.get('samples');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.data');
          ac.error(err);
        }
        else {
          ac.done(data, 'json');
        }
      });
    },

    autocomplete: function (ac) {
      var model = ac.models.get('samples');
      model.autocomplete(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.autocomplete');
          ac.error(err);
        }
        else {
          ac.done(Y.JSON.stringify(data), 'json');
        }
      });
    },

    bird: function (ac) {
      var model = ac.models.get('samples');
      model.bird(ac.command.params.url, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.bird');
          ac.error(err);
        }
        else {
          ac.done(data, 'json');
        }
      });
    },

    create: function (ac) {
      var model = ac.models.get('samples');
      model.create(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.create');
          ac.error(err);
        }
        else {
          ac.done();
        }
      });
    },

    update: function (ac) {
      var model = ac.models.get('samples');
      model.update(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.update');
          ac.error(err);
        }
        else {
          ac.done();
        }
      });
    },

    'delete': function (ac) {
      var model = ac.models.get('samples');
      model['delete'](ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.delete');
          ac.error(err);
        }
        else {
          ac.done();
        }
      });
    },

    findSample: function (ac) {
      var model = ac.models.get('samples');
      model.findSample(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.findSimple');
          ac.error(err);
        }
        else {
          ac.done(data, 'json');
        }
      });
    },

    addNote: function (ac) {
      var model = ac.models.get('samples');
      model.addNote(ac.command.params.body, function (err, data) {
        if (err) {
          Y.log('error condition', 'error', NAME + '.addNote');
          ac.error(err);
        }
        else {
          ac.done();
        }
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon', 'addon-ac-pg']});
