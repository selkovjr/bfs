YUI.add('Body-tests', function(Y) {
  var
    suite = new YUITest.TestSuite('Body-tests'),
    controller = null,
    A = YUITest.Assert;

  suite.add(new YUITest.TestCase({
    name: 'Body user tests',

    setUp: function () {
      controller = Y.mojito.controllers.Body;
    },
    tearDown: function () {
      controller = null;
    },

    'test mojit': function () {
      var
        ac,
        assetsResults,
        doneResults;

      ac = {
        assets: {
          addCss: function(css) {
            assetsResults = css;
          }
        },
        composite: {
          done: function(data) {
            doneResults = data;
          }
        }
      };

      A.isNotNull(controller);
      A.isFunction(controller.index);
      controller.index(ac);
      A.areSame('./index.css', assetsResults);
      A.isObject(doneResults);
      A.areSame('Body title', doneResults.title);
    }
  }));

  YUITest.TestRunner.add(suite);
}, '0.0.1', {requires: ['Body', 'mojito-test']});
