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
            console.error('error condition');
            ac.error(err);
          }
          ac.assets.addCss('./index.css');
          ac.done({
            title: "Samples",
            nsamples: data,
            auth: user.auth.samples
          });
        });
      }
      else {
        ac.done({});
      }
    },

    data: function (ac) {
      var model = ac.models.get('samples');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done(data, 'json');
      });
    },

    autocomplete: function (ac) {
      var model = ac.models.get('samples');
      model.autocomplete(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done(Y.JSON.stringify(data), 'json');
      });
    },

    bird: function (ac) {
      var model = ac.models.get('samples');
      model.bird(ac.command.params.url, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done(data, 'json');
      });
    },

    create: function (ac) {
      var model = ac.models.get('samples');
      model.create(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done();
      });
    },

    update: function (ac) {
      var model = ac.models.get('samples');
      model.update(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done();
      });
    },

    'delete': function (ac) {
      var model = ac.models.get('samples');
      model['delete'](ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done();
      });
    },

    findSample: function (ac) {
      var model = ac.models.get('samples');
      model.findSample(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done(data, 'json');
      });
    },

    addNote: function (ac) {
      var model = ac.models.get('samples');
      model.addNote(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
        }
        ac.done();
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon', 'addon-ac-pg']});
