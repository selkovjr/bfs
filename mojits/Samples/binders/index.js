/*global YUI */
/*jslint regexp: true, indent: 2 */
YUI.add('SamplesBinderIndex', function (Y, NAME) {
  'use strict';
/**
 * The SamplesBinderIndex module.
 *
 * @module SamplesBinderIndex
 */

  var Sample, SampleList, sampleList;

  // Table row model
  Sample = Y.Base.create('sample-record', Y.Model, [], {}, {
    ATTRS: {
      id: {},
      emc_id: {},
      date: {},
      type: {},
      bird: {},
      age: {},
      sex: {},
      ring: {},
      clin_st: {},
      vital_st: {},
      capture_method: {},
      location: {},
      location_name: {}
    }
  });

  // Model list
  SampleList = Y.Base.create('sample-list', Y.ModelList, [], {
    url: 'mojito', // need a fake URL property to trick the paginator into using the 'mlist' datasource

    parseDataSchema: function (resp) {
      var parsed = Y.DataSchema.JSON.apply(this.get('dsSchema'), resp);
      Y.log(resp);
      Y.log(parsed);
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
  sampleList = new SampleList({
    model: Sample,

    // This attribute describes the structure of server responses
    dsSchema: {
      resultListLocator: 'rows',
      resultFields: [
        'id',
        'emc_id',
        'date',
        'type',
        'bird',
        'age',
        'sex',
        'ring',
        'clin_st',
        'vital_st',
        'capture_method',
        'location',
        'location_name'
      ],
      metaFields: {
        indexStart: 'paging.itemIndexStart',
        pageRecs:   'paging.itemsPerPage',
        totalItems: 'paging.totalItems' // corresponds to 'totalItems' in  serverPaginationMap
      }
    }
  });

  /**
   The only purpose of subclassing Y.DataTable.BaseCellInlineEditor
   is to apply the `bird-list` style to its input node. Other than
   that, it is a a clone of the `inlineAC` editor.

  @class Y.DataTable.EditorOptions.inlineBirdAC
  @public
  */
  Y.DataTable.EditorOptions.inlineBirdAC = {
    BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
    name:           'inlineBirdAC',
    hideMouseLeave: false,

    after: {
      editorCreated: function (o) {
        var
          inputNode = o.inputNode,
          // Get the users's editorConfig "autocompleteConfig" settings
          acConfig = this.get('autocompleteConfig') || {},
          editor = this;

        if (inputNode && Y.Plugin.AutoComplete) {
          // merge user settings with these required settings ...
          acConfig = Y.merge(acConfig, {
            alwaysShowList: true,
            render: true
          });
          // plug in the autocomplete and we're done ...
          inputNode.plug(Y.Plugin.AutoComplete, acConfig);

          // add this View class as a static prop on the ac plugin
          inputNode.ac.editor = editor;
          inputNode.ac.get('listNode').ancestor().addClass('bird-list');
        }
      }
    }
  };

  /**
   The only purpose of subclassing Y.DataTable.BaseCellInlineEditor
   is to apply the `location-list` style to its input node. Other than
   that, it is a a clone of the `inlineAC` editor.

   This class may be replaced with something entirely different in
   the future (possibily a map widget with the option of adding new
   locations.

  @class Y.DataTable.EditorOptions.inlineLocationAC
  @public
  */
  Y.DataTable.EditorOptions.inlineLocationAC = {
    BaseViewClass:  Y.DataTable.BaseCellInlineEditor,
    name:           'inlineLocationAC',
    hideMouseLeave: false,

    after: {
      editorCreated: function (o) {
        var
          inputNode = o.inputNode,
          // Get the users's editorConfig "autocompleteConfig" settings
          acConfig = this.get('autocompleteConfig') || {},
          editor = this;

        if (inputNode && Y.Plugin.AutoComplete) {
          // merge user settings with these required settings ...
          acConfig = Y.merge(acConfig, {
            alwaysShowList: true,
            render: true
          });
          // plug in the autocomplete and we're done ...
          inputNode.plug(Y.Plugin.AutoComplete, acConfig);

          // add this View class as a static prop on the ac plugin
          inputNode.ac.editor = editor;
          inputNode.ac.get('listNode').ancestor().addClass('location-list');
        }
      }
    }
  };

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
      Y.log('calling binder.init()');

      this.mojitProxy = mojitProxy;

      // This function is an adapter between mojitProxy and ModelList.
      sampleList.sync = function (action, arg, callback) {
        var
          order,
          options,
          response;

        if (action === 'read') {
          options = {
            params: {
              body: {
                itemsPerPage: arg.itemsPerPage,
                itemIndexStart: arg.itemIndexStart
              }
            }
          };

          // Convert the ModelList sortBy list-of-hashes format to pgrest 's' hash.
          if (arg.sortBy) {
            options.params.body.sortBy = arg.sortBy;
            order = Y.Array.map(Y.JSON.parse(arg.sortBy), function (o) {
              if (typeof o === 'string') {
                return '"' + o + '": ' + '1';
              }
              var key = Y.Object.keys(o)[0];
              return '"' + key + '": ' + o[key];
            });
            options.params.body.s = '{' + order.join(', ') + '}';
          }

          mojitProxy.invoke('data', options, function (err, data) {
            if (err) {
              callback('server transaction error: ' + err);
            } else {
              callback(null, data);
            }
          });
        } else {
          callback('Unsupported sync action: ' + action);
        }
      };

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
        acOptions,
        sizeSyncMethod = '_syncPaginatorSize',
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

      Y.on('domready', Y.bind(function () {
        Y.one('body').addClass('yui3-skin-sam');

        // Get the list of autocomplete options
        mp.invoke('autocomplete', null, function (err, data) {
          if (err) {
            Y.log('server transaction error: ' + err, 'error', 'Samples binder');
          } else {
            acOptions = Y.JSON.parse(data);

            table = new Y.DataTable({
              columns: [
                {
                  key: 'id',
                  label: 'ID',
                  sortable: true,
                  className: 'nowrap'
                },

                {
                  key: 'emc_id',
                  label: 'EMC ID',
                  sortable: true,
                  editor: 'inline'
                },

                {
                  key: 'date',
                  label: 'Date',
                  sortable: true,
                  editor: 'inlineDate',
                  editorConfig: {
                    dateFormat: '%Y-%m-%d'
                  },
                  prepFn: function (v) {
                    var dfmt = "%Y-%m-%d";
                    return Y.DataType.Date.format(v, {format: dfmt});
                  },
                  formatter: function (o) {
                    return o.value && Y.DataType.Date.format(o.value, {format: "%Y-%m-%d"});
                  }
                },

                {
                  key: 'type',
                  label: 'Type',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.type,
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
                  key: 'bird',
                  label: 'Bird',
                  sortable: true,
                  editor: 'inlineBirdAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: '/bird?q={query}',
                      maxResults: 100,
                      activateFirstItem: true,
                      resultHighlighter: 'phraseMatch',
                      resultTextLocator: function (result) {
                        return result.common_name + ' (' + result.name + ')';
                      },
                      on: {
                        select: function (e) {
                          this.editor.saveEditor(e.result.raw);
                        }
                      }
                    }
                  },
                  formatter: function (o) {
                    if (typeof o.value === 'object' && o.value.common_name) {
                      return o.value.common_name;
                    }
                    return o.value;
                  }
                },

                {
                  key: 'age',
                  label: 'Age',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.age,
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
                  key: 'sex',
                  label: 'Sex',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.sex,
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
                  key: 'ring',
                  label: 'Ring',
                  sortable: true,
                  editor: 'inline'
                },

                {
                  key: 'clin_st',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.clin_st,
                      minQueryLength: 0,
                      activateFirstItem: true,
                      resultFilters: function (query, results) {
                        // match at the first character
                        query = query.toLowerCase();
                        return Y.Array.filter(results, function (result) {
                          return result.text.toLowerCase().indexOf(query) === 0;
                        });
                      },
                      resultHighlighter: 'phraseMatch',
                      on: {select: highlightCleanup}
                    },
                    on: {editorShow: nudge}
                  }
                },

                {
                  key: 'vital_st',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.vital_st,
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
                  key: 'capture_method',
                  label: 'Capture method',
                  sortable: true,
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      minQueryLength: 0,
                      activateFirstItem: true,
                      source: acOptions.capture_method,
                      resultFilters: function (query, results) {
                        query = query.toLowerCase();
                        return Y.Array.filter(results, function (result) {
                          return result.text.toLowerCase().indexOf(query) !== -1;
                        });
                      },
                      resultHighlighter: 'phraseMatch',
                      on: {
                        select: function (e) {
                          this.editor.saveEditor(e.result.raw);
                        }
                      }
                    },
                    on: {editorShow: nudge}
                  }
                },

                {
                  key: 'location_name',
                  label: 'Location',
                  sortable: true,
                  editor: 'inlineLocationAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: '/location?q={query}',
                      maxResults: 100,
                      activateFirstItem: true,
                      resultHighlighter: 'phraseMatch',
                      resultTextLocator: function (result) {
                        return result.name + ' (' + result.lat + ', ' + result.long + ')';
                      },
                      on: {
                        select: function (e) {
                          // this.editor.saveEditor(e.result.raw);
                          this.editor.saveEditor(e.result.raw);
                        }
                      // },
                      } // on: {editorShow: nudge}
                    }
                  },
                  formatter: function (o) {
                    if (typeof o.value === 'object' && o.value.name) {
                      return o.value.name;
                    }
                    return o.value;
                  }
                }
              ],

              data: sampleList,
              scrollable: 'xy',
              sortable: true,
              height: '290px',
              width: Y.one('#samples').getComputedStyle('width'),
              sortBy: [{date: 1}, {id: 1}],

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

              // No mapping is needed as the names match paginator's defaults.
              // serverPaginationMap: {
              //   totalItems:     'totalItems',
              //   itemsPerPage:   'itemsPerPage',
              //   itemIndexStart: 'itemIndexStart'
              // },

              highlightMode: 'row',
              selectionMode: 'row',
              selectionMulti: false,

              editable:      true,
              // defaultEditor: 'inlineAC',
              editOpenType:  'dblclick'
            }); // new DataTable

            table[sizeSyncMethod] = function () {
              return false;
            };

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
              var
                options,
                dfmt = "%Y-%m-%d",
                newVal = e.newVal,
                id = e.record.get('id');

              if (e.colKey === 'date') {
                newVal = Y.DataType.Date.format(e.newVal, {format: dfmt});
              }

              if (e.colKey === 'bird' && newVal.common_name) {
                Y.log(['testing', newVal.common_name, e.prevVal]);
                Y.log('Editor: ' + e.editorName + 'in sample ' + id + ' saved newVal=' + newVal.common_name + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
                options = {
                  params: {
                    body: {
                      id: id,
                      attr: 'species',
                      value: newVal.id
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
              if (e.colKey === 'location_name' && newVal.name) {
                Y.log(['testing', newVal.name, e.prevVal]);
                Y.log('Editor: ' + e.editorName + 'in sample ' + id + ' saved newVal=' + newVal.name + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
                options = {
                  params: {
                    body: {
                      id: id,
                      attr: 'location',
                      value: newVal.id
                    }
                  },
                  rpc: true
                };
                // The newVal object gets saved in the cell and its property `name` is displayed
                // by a formatter defined on the column. However, the formatter is not called
                // by the inlined editor, and it attempts to edit the stringified version of
                // object. To prevet this, replace the object with its `name` property.
                e.record.set('location_name', newVal.name);
                mp.invoke('update', options, function (err, data) {
                  if (err) {
                    Y.log('update failed');
                  } else {
                    Y.log('update successful');
                  }
                });
              } else {
                Y.log(['testing', newVal, e.prevVal]);
                Y.log('Editor: ' + e.editorName + 'in sample ' + id + ' saved newVal=' + newVal + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
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
              }
            });

          } // got autocomplete options
        }); // invoke autocomplete data
      }, this)); // on domready


      // Refresh the content when user clicks refresh button.
      Y.one('#samples').delegate('click', function (e) {
        e.halt();
        table.processPageRequest(table.pagModel.get('page'));
      }, 'a.refresh');

      Y.on('windowresize', function (e) {
        table.set('width', Y.one('#samples').getComputedStyle('width'));
      });
    } // bind()
  };
}, '0.0.1', {
  requires: [
    'autocomplete',
    'autocomplete-highlighters',
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
