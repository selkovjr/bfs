YUI.add('SamplesModel-tests', function(Y, NAME) {

  var suite = new YUITest.TestSuite(NAME),
  model = null,
  A = YUITest.Assert;

  suite.add(new YUITest.TestCase({

    name: 'SamplesModel user tests',

    setUp: function () {
      model = Y.mojito.models.SamplesModel;
    },
    tearDown: function () {
      model = null;
    },

    'test mojit model': function () {
      var
        modelCalled = false,
        cfg = {color: 'red'};

      A.isNotNull(model);

      A.isFunction(model.init);
      model.init(cfg);
      A.areSame(cfg, model.config);

      A.isFunction(model.getData);
      model.getData(function (err, data) {
        A.isTrue(!err);
        A.isObject(data);
        A.areSame(1873, data.paging.count);
        modelCalled = true;
      });
      Y.later(1000, this, function () {A.isTrue(modelCalled);});
    }

  }));

  YUITest.TestRunner.add(suite);

}, '0.0.1', {requires: ['mojito-test', 'SamplesModel']});
