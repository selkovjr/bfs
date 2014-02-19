/*global YUI, console */
/*jslint indent: 2 */
YUI.add('Samples', function (Y, NAME) {
  'use strict';

  Y.namespace('mojito.controllers')[NAME] = {
    index: function (ac) {
      var
        model = ac.models.get('samples'),
        user = ac.http.getRequest().user;

      if (user) {
        model.count(null, function (err, data) {
          if (err) {
            console.error('error condition');
            ac.error(err);
            return;
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
          return;
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
          return;
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
          return;
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
          return;
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
          return;
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
          return;
        }
        ac.done();
      });
    },

    find: function (ac) {
      var model = ac.models.get('samples');
      model.find(ac.command.params.body, function (err, data) {
        if (err) {
          console.error('error condition');
          ac.error(err);
          return;
        }
        ac.done(data, 'json');
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon']});
