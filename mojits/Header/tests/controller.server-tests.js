YUI.add('Header-tests', function(Y) {
  var
    suite = new YUITest.TestSuite('Header-tests'),
    controller = null,
    A = YUITest.Assert;

  suite.add(new YUITest.TestCase({
    name: 'Header user tests',

    setUp: function () {
      controller = Y.mojito.controllers.Header;
    },
    tearDown: function () {
      controller = null;
    },

    'test mojit': function () {
      var
        ac1, ac2,
        assetsResults,
        doneResults;

      ac1 = {
        http: {
          getRequest: function () {
            return {};
          }
        },
        assets: {
          addCss: function(css) {
            assetsResults = css;
          }
        },
        done: function(data) {
          doneResults = data;
        }
      };

      ac2 = {
        http: {
          getRequest: function () {
            return {
              user: {
                name: 'Test User'
              }
            };
          }
        },
        assets: {
          addCss: function(css) {
            assetsResults = css;
          }
        },
        done: function(data) {
          doneResults = data;
        }
      };

      A.isNotNull(controller);
      A.isFunction(controller.index);
      controller.index(ac1);
      A.areSame('./index.css', assetsResults);
      A.isObject(doneResults);
      A.areSame('Header title', doneResults.title);
      controller.index(ac2);
      A.areSame('user: Test User', doneResults.title);
    }
  }));

  YUITest.TestRunner.add(suite);
}, '0.0.1', {requires: ['mojito-test', 'Header']});
