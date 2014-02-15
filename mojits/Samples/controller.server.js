/*global YUI, console */
/*jslint indent: 2 */
YUI.add('Samples', function (Y, NAME) {
  'use strict';

  Y.namespace('mojito.controllers')[NAME] = {
    index: function (ac) {
      console.log(['controller index()', ac.command.params.body], 'info', 'Samples');
      var
        model = ac.models.get('samples'),
        user = ac.http.getRequest().user;

      if (user) {
        model.count(null, function (err, data) {
          if (err) {
            console.log('error condition');
            ac.error(err);
            return;
          }
          ac.assets.addCss('./index.css');
          console.log(data);
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
      console.log(['controller data()', ac.command.params.body], 'info', 'Samples');
      var model = ac.models.get('samples');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          console.log('error condition');
          ac.error(err);
          return;
        }
        console.log(data);
        ac.done(data, 'json');
      });
    },

    autocomplete: function (ac) {
      var model = ac.models.get('samples');
      model.autocomplete(ac.command.params.body, function (err, data) {
        if (err) {
          console.log('error condition');
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
          console.log('error condition');
          ac.error(err);
          return;
        }
        ac.done(data, 'json');
      });
    },

    update: function (ac) {
      console.log(ac.command.params.body);
      var model = ac.models.get('samples');
      model.update(ac.command.params.body, function (err, data) {
        if (err) {
          console.log('error condition');
          ac.error(err);
          return;
        }
        ac.done();
      });
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-http-addon', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon']});
