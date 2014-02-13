/*global YUI, console*/
/*jslint anon:true, sloppy:true, nomen:true*/
YUI.add('Samples', function (Y, NAME) {

  Y.namespace('mojito.controllers')[NAME] = {
    index: function (ac) {
      var model = ac.models.get('samples');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          console.log('error condition');
          ac.error(err);
          return;
        }
        ac.assets.addCss('./index.css');
        ac.done({
          title: "Samples",
          nsamples: data.tableSize,
          entries: data.rows
        });
      });
    },

    data: function (ac) {
      console.log(ac.command.params.body);
      var model = ac.models.get('samples');
      model.getData(ac.command.params.body, function (err, data) {
        if (err) {
          console.log('error condition');
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
}, '0.0.1', {requires: ['mojito', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon']});
