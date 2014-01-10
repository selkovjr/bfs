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
          nsamples: data.paging.count,
          entries: data.entries
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
    }
  };
}, '0.0.1', {requires: ['mojito', 'mojito-models-addon', 'mojito-data-addon', 'mojito-assets-addon']});
