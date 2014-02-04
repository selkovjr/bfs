/*jslint anon: true, sloppy: true, nomen: true */
/*global YUI: false */
YUI.add('SamplesBinderIndex', function (Y, NAME) {
/**
 * The SamplesBinderIndex module.
 *
 * @module SamplesBinderIndex
 */

  var Sample, SampleList, sampleList;

  // Table row model
  Sample = Y.Base.create('sample-record', Y.Model, [], {}, {
    ATTRS:{
      id: {},
      emc_id: {},
      date: {},
      bird: {},
      age: {},
      sex: {},
      ring: {},
      clin_st: {},
      vital_st: {},
      capture_method: {},
      location: {},
      type: {}
    }
  });

  // Model list
  SampleList = Y.Base.create('sample-list', Y.ModelList, [], {
    url: 'mojito', // need a fake URL property to trick the paginator into using the 'mlist' datasource

    parseDataSchema: function (resp) {
      var parsed = Y.DataSchema.JSON.apply(this.get('dsSchema'), resp);
      return {
        resp: resp,
        parsed: parsed,
        results: parsed.results,
        meta: parsed.meta
      };
    },

    parse: function (resp) {
      var parsedObj = this.parseDataSchema(resp);
      this.fire('response',  parsedObj); // {resp: resp, parsed: parsed, meta: metadata, results: results});
      return parsedObj.results || [] ;
    }
  }, {
    ATTRS:{
      // Define a schema as an attribute so we can parse the response using DataSchemaJSON ...
      dsSchema:   {}
    }
  });

  // ModelList instance
  sampleList = new SampleList({
    model: Sample,

    // This attribute describes the structure of server responses
    dsSchema: {
      resultListLocator: 'entries',
      resultFields: [
        'id',
        'emc_id',
        'date',
        'bird',
        'age',
        'sex',
        'ring',
        'clin_st',
        'vital_st',
        'capture_method',
        'location',
        'type'
      ],
      metaFields: {
        indexStart: 'paging.sk',
        pageRecs:   'paging.l',
        count:      'paging.count' // corresponds to 'totalItems' in  serverPaginationMap
      }
    }
  });

  /**
   * Constructor for the SamplesBinderIndex class.
   *
   * @class SamplesBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {

    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function (mojitProxy) {
      this.mojitProxy = mojitProxy;

      // This function is an adapter between mojitProxy and ModelList.
      sampleList.sync = function (action, arg, callback) {
        var
          order,
          options = {},
          response;

        if (action === 'read') {
          options = {
            params: {
              body: {
                l: arg.l,
                sk: arg.sk
              }
            }
          };

          // Convert the ModelList sortBy list-of-hashes format to pgrest 's' hash.
          if (arg.sortBy) {
            order = Y.Array.map(Y.JSON.parse(arg.sortBy), function (o) {
              var key = Y.Object.keys(o)[0];
              return '"' + key + '": ' + o[key];
            });
            options.params.body.s = '{' + order.join(', ') + '}';
          }

          mojitProxy.invoke('data', options, function (err, data) {
            if (err) {
              callback('server transaction error: ' + err);
            }
            else {
              callback(null, data);
            }
          });
        }
        else {
          callback('Unsupported sync action: ' + action);
        }
      };
    },

    /**
     * The binder method, invoked to allow the mojit to attach DOM event
     * handlers.
     *
     * @param node {Node} The DOM node to which this mojit is attached.
     */
    bind: function (node) {
      var
        mp = this.mojitProxy,
        table,
        sizeSyncMethod = '_syncPaginatorSize';

      Y.on('domready', function () {
        Y.one('body').addClass('yui3-skin-sam');

        table = new Y.DataTable({
          columns: [
            {key: 'id', label: 'ID', sortable: true, className: 'nowrap'},
            {key: 'emc_id', label: 'EMC ID'},
            {
              key: 'date',
              label: 'Date',
              editor: 'inlineDate',
              editorConfig: {
                // For some resone, setting format here is not enough. It only
                // works the first time, then the cell editor reverts to YY/dd/mm.
                dateformat: '%Y-%m-%d'
              },
              prepFn: function (v) {
                var dfmt = "%Y-%m-%d";
                return Y.DataType.Date.format(v, {format: dfmt});
              },
              formatter: function (o) {
                return o.value &&
                  Y.DataType.Date.format(o.value, {format: "%Y-%m-%d"});
              }
            },
            {key: 'bird', label: 'Bird'},
            {
              key: 'age',
              label: 'Age',
              editor: 'inlineAC',
              editorConfig: {
                autocompleteConfig: {
                  source: [
                    'adult',
                    'subadult',
                    'juvenile',
                    'first year',
                    'second year'
                  ],
                  on: {
                    select: function(r) {
                      var val = r.result.display;
                      this.editor.saveEditor(val);
                    }
                  }
                }
              }
            },
            'sex',
            'ring',
            'clin_st',
            'vital_st',
            'capture_method',
            'location',
            'type'
          ],

          data: sampleList,
          scrollable: 'xy',
          sortable: true,
          height: '290px',
          width: Y.one('#samples').getComputedStyle('width'),
          sortBy: [{date: 1}, {type: 1}],

          paginator: new Y.PaginatorView({
            model: new Y.PaginatorModel({
              itemsPerPage: 10
            }),
            container:         '#samples-paginator',
            paginatorTemplate:  Y.one('#paginator-bar-template').getHTML(),
            pageOptions:        [10, 25, 50, 100, 'All']
          }),

          paginatorResize:    true,
          paginationSource:  'server',

          serverPaginationMap: {
            totalItems:     'count',
            itemsPerPage:   'l',
            itemIndexStart: 'sk'
          },

          highlightMode: 'row',
          selectionMode: 'row',
          selectionMulti: false,

          editable:      true,
          // defaultEditor: 'inlineAC',
          editOpenType:  'dblclick'
        });

        table[sizeSyncMethod] = function() {return false;};

        table.render('#samples-table');
        table.processPageRequest(1);

        table.on('selection', function (e) {
          Y.log(['selection', e]);
          mp.broadcast('row-selected', {row: e.rows[0]});
        });

        //
        //  Set a listener to DT's cell editor save event so that we can synchronize
        //  changes with a remote server (i.e. DataSource)
        //
        table.after('cellEditorSave', function (e) {
          var dfmt = "%Y-%m-%d";
          Y.log(Y.DataType.Date.format(e.newVal, {format: dfmt}));
          Y.log('Editor: ' + e.editorName + ' saved newVal=' + e.newVal + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
        });

        table.after('editorShow', function (e) {
          var inputNode = e.inputNode;
          Y.log('--------------editorCreated------------');
          Y.log(inputNode);
        });

      }); // on domready


      // Refresh the content when user clicks refresh button.
      Y.one('#samples').delegate('click', function (e) {
        e.halt();
        table.processPageRequest(table.pagModel.get('page'));
      }, 'a.refresh');

      Y.on('windowresize', function (e) {
        table.set('width', Y.one('#samples').getComputedStyle('width'));
      });
    }
  };
}, '0.0.1', {
  requires: [
    'event-mouseenter',
    'mojito-client',
    'node-base',
    'datatable-sort',
    'datatable-scroll',
    'cssfonts',
    'cssbutton',
    'dataschema-json',
    'datatable-datasource',
    'datasource-io',
    'datasource-jsonschema',
    'gallery-datatable-selection',
    'gallery-datatable-editable',
    'gallery-datatable-celleditor-inline',
    'gallery-datatable-paginator',
    'gallery-paginator-view'
  ]
});
