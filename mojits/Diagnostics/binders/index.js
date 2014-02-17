/*global YUI */
/*jslint regexp: true, indent: 2 */
YUI.add('DiagnosticsBinderIndex', function (Y, NAME) {
  'use strict';
/**
 * The DiagnosticsBinderIndex module.
 *
 * @module DiagnosticsBinderIndex
 */

  var
    Model,
    ModelList,
    modelList,
    sampleIDFromParent,
    sampleID,
    createListener;

  // Table row model
  Model = Y.Base.create('diagnostics-record', Y.Model, [], {}, {
    ATTRS: {
      sample: {},
      rec_date: {},
      date: {},
      pool: {},
      ma_status: {},
      ma_ct: {},
      h5_status: {},
      h5_ct: {},
      h5_pt: {},
      h7_status: {},
      h7_ct: {},
      h7_pt: {},
      h9_status: {},
      h9_ct: {}
    }
  });

  // Model list
  ModelList = Y.Base.create('diagnostics-list', Y.ModelList, [], {
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
      return parsedObj.results || [];
    }
  }, {
    ATTRS: {
      // Define a schema as an attribute so we can parse the response using DataSchemaJSON ...
      dsSchema:   {}
    }
  });

  // ModelList instance
  modelList = new ModelList({
    model: Model,

    // This attribute describes the structure of server responses
    dsSchema: {
      resultFields: [
        'sample',
        'rec_date',
        'date',
        'pool',
        'ma_status',
        'ma_ct',
        'h5_status',
        'h5_ct',
        'h5_pt',
        'n7_status',
        'h7_ct',
        'h7_pt',
        'h9_status',
        'h9_ct'
      ]
    }
  });

  /**
   * Constructor for the DiagnosticsBinderIndex class.
   *
   * @class DiagnosticsBinderIndex
   * @constructor
   */
  Y.namespace('mojito.binders')[NAME] = {

    /**
     * Binder initialization method, invoked after all binders on the page
     * have been constructed.
     */
    init: function (mojitProxy) {
      sampleIDFromParent = Y.one('#sample_id').get('value');
      sampleID = Y.one('#sample').get('value');

      this.mojitProxy = mojitProxy;

      // This function is an adapter between mojitProxy and ModelList.
      modelList.sync = function (action, arg, callback) {
        var
          options,
          response;

        if (action === 'read') {
          options = {
            params: {
              body: {
                id: sampleID
              }
            }
          };

          mojitProxy.invoke('data', options, function (err, data) {
            if (err) {
              callback('server transaction error: ' + err);
            } else {
              callback(null, [data]); // data is a single row
            }
          });
        } else {
          callback('Unsupported sync action: ' + action);
        }
      };

      this.editable = !Y.one('#diagnostics').hasClass('read-only');
    }, // init()

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
        tableConfig,
        acOptions,
        render,
        autocompleteFilter = function (query, results) {
          query = query.toLowerCase();
          return Y.Array.filter(results, function (result) {
            return result.text.toLowerCase().indexOf(query) !== -1;
          });
        },
        highlightCleanup = function (e) {
          // autocomplete selection is sometimes returned with html highligts in it
          var val = e.result.display.replace(/<[^>]+>/g, '').replace('&#x2F;', '/');
          this.editor.saveEditor(val);
        },
        nudge = function (e) {
          // make sure the autocomplete list opens when the cell is blank
          e.inputNode.ac.sendRequest('');
        };

      render = Y.bind(function () {
        Y.log(['sample id', sampleID]);
        if (this.editable) {
          if (sampleID !== '') {
            // Get the list of autocomplete options
            mp.invoke('autocomplete', null, function (err, data) {
              if (err) {
                Y.log('server transaction error: ' + err, 'error', 'Diagnostics binder');
              } else {
                acOptions = Y.JSON.parse(data);
              }
              table = new Y.DataTable({
                columns: [
                  {
                    key: 'rec_date',
                    label: 'Received',
                    formatter: function (o) {
                      return o.value && Y.DataType.Date.format(o.value, {format: "%Y-%m-%d"});
                    },
                    editor: 'inlineDate',
                    editorConfig: {
                      dateFormat: '%Y-%m-%d'
                    },
                    prepFn: function (v) {
                      var dfmt = "%Y-%m-%d";
                      return Y.DataType.Date.format(v, {format: dfmt});
                    }
                  },

                  {
                    key: 'date',
                    label: 'TaqMan date',
                    formatter: function (o) {
                      return o.value && Y.DataType.Date.format(o.value, {format: "%Y-%m-%d"});
                    },
                    editor: 'inlineDate',
                    editorConfig: {
                      dateFormat: '%Y-%m-%d'
                    },
                    prepFn: function (v) {
                      var dfmt = "%Y-%m-%d";
                      return Y.DataType.Date.format(v, {format: dfmt});
                    }
                  },

                  {
                    key: 'pool',
                    label: 'Pool',
                    editor: 'inlineNumber'
                  },

                  {
                    key: 'ma_status',
                    label: 'MA Status',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.ma_status,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'ma_ct',
                    label: 'MA Ct',
                    editor: 'inlineNumber'
                  },

                  {
                    key: 'h5_status',
                    label: 'H5 Status',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.h5_status,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'h5_ct',
                    label: 'H5 Ct',
                    editor: 'inlineNumber'
                  },

                  {
                    key: 'h5_pt',
                    label: 'H5 Pathotype',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.h5_pt,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'h7_status',
                    label: 'H7 Status',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.h7_status,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'h7_ct',
                    label: 'H7 Ct',
                    editor: 'inlineNumber'
                  },

                  {
                    key: 'h7_pt',
                    label: 'H7 Pathotype',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.h7_pt,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'h9_status',
                    label: 'H9 Status',
                    editor: 'inlineAC',
                    editorConfig: {
                      autocompleteConfig: {
                        source: acOptions.h9_status,
                        minQueryLength: 0,
                        activateFirstItem: true,
                        resultFilters: autocompleteFilter,
                        resultHighlighter: 'phraseMatch',
                        on: {select: highlightCleanup}
                      },
                      on: {editorShow: nudge}
                    }
                  },

                  {
                    key: 'h9_ct',
                    label: 'H9 Ct',
                    editor: 'inlineNumber'
                  }
                ],

                data: modelList,
                scrollable: 'x',

                editable: true,
                editOpenType: 'dblclick'
              }); // table = new Y.DataTable()


              Y.one('#diagnostics-table').empty(); // remove the "Loading" message
              table.data.load(function () {
                table.render('#diagnostics-table');
              });

              //
              //  Set a listener to DT's cell editor save event so that we can synchronize
              //  changes with a remote server (i.e. DataSource)
              //
              table.after('cellEditorSave', function (e) {
                var
                  options,
                  dfmt = "%Y-%m-%d",
                  newVal = e.newVal,
                  id = e.record.get('sample');

                if (e.colKey === 'date' || e.colKey === 'rec_date') {
                  newVal = Y.DataType.Date.format(e.newVal, {format: dfmt});
                }

                Y.log(['testing', newVal, e.prevVal]);
                Y.log('Editor: ' + e.editorName + ' saved newVal=' + newVal + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
                if (newVal !== e.prevVal) {
                  options = {
                    params: {
                      body: {
                        id: id,
                        attr: e.colKey,
                        value: newVal
                      }
                    },
                    rpc: true
                  };
                  mp.invoke('update', options, function (err, data) {
                    if (err) {
                      Y.log('update failed');
                    } else {
                      Y.log('update successful');
                    }
                  });
                }
              });
            }); // invoke autocomplete data
          } // sampleID non-null
          else {
            Y.one('#diagnostics-na').append('<button id="diagnostics-create" type="button">Create</button>');
            createListener = Y.one('#diagnostics-create').on('click', function (e) {
              var options = {
                params: {
                  body: {
                    id: sampleIDFromParent
                  }
                },
                rpc: true
              };
              mp.invoke('create', options, function (err, data) {
                if (err) {
                  Y.log('create failed');
                } else {
                  Y.log('create successful');
                  sampleID = sampleIDFromParent;
                  render();
                }
              });
            });
          }
        } // editable
      }, this); // render()

      Y.on('domready', render, this);

      // Refresh the content when user clicks refresh button.
      Y.one('#diagnostics').delegate('click', function (e) {
        e.halt();
        table.data.load(function () {
          table.render('#diagnostics-table');
        });
      }, 'a.refresh');

    } // bind()
  };
}, '0.0.1', {requires: ['event-mouseenter', 'mojito-client']});
