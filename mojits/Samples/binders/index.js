/*global YUI, alert */
/*jslint regexp: true, indent: 2 */
YUI.add('SamplesBinderIndex', function (Y, NAME) {
  'use strict';

/**
 * The SamplesBinderIndex module.
 *
 * @module SamplesBinderIndex
 */

  var table, Sample, SampleList, sampleList;

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
      tos: {},
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
        'tos',
        'capture_method',
        'location',
        'location_name'
      ],
      metaFields: {
        indexStart: 'paging.itemIndexStart',
        pageRecs:   'paging.itemsPerPage',
        totalItems: 'paging.totalItems', // corresponds to 'totalItems' in  serverPaginationMap
        notes: 'notes'
      }
    }
  });

  /**
   The purpose of subclassing Y.DataTable.BaseCellPopupEditor
   is to apply the `bird-list` style to its input node, to set focus
   to the input node, and to replace the bird object with the bird's
   common name as input value. Other than that, it is just a clone of the
   `autocomplete` editor.
  */

  Y.DataTable.EditorOptions.birdAC = {
    BaseViewClass: Y.DataTable.BaseCellPopupEditor,
    name: 'birdAC',
    templateObject: {
      html: '<input type="text" title="inline cell editor" class="<%= this.classInput %>" />'
    },
    inputKeys:   true,

    // Set listeners to this View's instance ....
    on: {
      editorShow: function (e) {
        // Because cell formatter does not get called in the popup editor version
        if (typeof e.cell.value === 'object' && e.cell.value.common_name) {
          // e.cell.value = e.cell.value.common_name;
          e.inputNode.set('value', e.cell.value.common_name);
        }
        e.inputNode.focus();
      }
    },

    after: {
      //---------
      //  After the cell editor View is instantiated,
      //    get the INPUT node and plugin the AutoComplete to it
      //---------
      editorCreated : function (e) {
        var inputNode = e.inputNode,
        acConfig = this.get('autocompleteConfig') || {},
        editor = this;

        // If input node exists and autocomplete-plugin is available, plug the sucker in!
        if (inputNode && Y.Plugin.AutoComplete) {
          acConfig = Y.merge(acConfig, {
            alwaysShowList: true,
            render: true
          });
          inputNode.plug(Y.Plugin.AutoComplete, acConfig);

          // add this View class as a static prop on the ac plugin
          inputNode.ac.editor = editor;
          inputNode.ac.get('listNode').ancestor().addClass('bird-list');
        }
      }
    }
  };

  /**
   The purpose of subclassing Y.DataTable.BaseCellInlineEditor
   is to apply the `location-list` style to its input node and
   to set focus on it. Other than that, it is a a clone of the
   `inlineAC` editor.

   This class may be replaced with something entirely different in
   the future (possibily a map widget with the option of adding new
   locations.
  */

  Y.DataTable.EditorOptions.locationAC = {
    BaseViewClass: Y.DataTable.BaseCellPopupEditor,
    name: 'locationAC',
    templateObject: {
      html: '<input type="text" title="inline cell editor" class="<%= this.classInput %>" />'
    },
    inputKeys:   true,

    // Set listeners to this View's instance ....
    on: {
      editorShow: function (e) {
        e.inputNode.focus();
      }
    },

    after: {
      //---------
      //  After the cell editor View is instantiated,
      //    get the INPUT node and plugin the AutoComplete to it
      //---------
      editorCreated : function (o) {
        var
          inputNode = o.inputNode,
          acConfig = this.get('autocompleteConfig') || {},
          editor = this;

        // If input node exists and autocomplete-plugin is available, plug the sucker in!
        if (inputNode && Y.Plugin.AutoComplete) {
          acConfig = Y.merge(acConfig, {
            alwaysShowList: true,
            render: true
          });
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
          options,
          response;

        Y.log('sync action: ' + action);
        if (action === 'read') {
          options = {
            params: {
              body: {
                itemsPerPage: arg.itemsPerPage,
                itemIndexStart: arg.itemIndexStart
              }
            }
          };

          if (arg.sortBy) {
            options.params.body.sortBy = arg.sortBy;
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

      this.editable = !Y.one('#samples').hasClass('read-only');
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
        tableConfig,
        acOptions,
        noteHeader,
        noteBody,
        noteEditorShown = false,
        keyUpListener,
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
          e.inputNode.focus();
          e.inputNode.ac.sendRequest('');
        };

      tableConfig = {
        columns: [
          { /* 0 */
            key: 'id',
            label: 'ID',
            sortable: true,
            className: 'nowrap'
          },

          { /* 1 */
            key: 'emc_id',
            label: 'EMC ID',
            sortable: true
          },

          { /* 2 */
            key: 'date',
            label: 'Date',
            sortable: true,
            formatter: function (o) {
              return o.value && Y.DataType.Date.format(o.value, {format: "%Y-%m-%d"});
            }
          },

          { /* 3 */
            key: 'type',
            label: 'Type',
            sortable: true
          },

          { /* 4 */
            key: 'bird',
            label: 'Bird',
            sortable: true,
            formatter: function (o) {
              if (typeof o.value === 'object' && o.value.common_name) {
                return o.value.common_name;
              }
              return o.value;
            }
          },

          { /* 5 */
            key: 'age',
            label: 'Age',
            sortable: true
          },

          { /* 6 */
            key: 'sex',
            label: 'Sex',
            sortable: true
          },

          { /* 7 */
            key: 'ring',
            label: 'Ring',
            sortable: true
          },

          { /* 8 */
            key: 'clin_st',
            sortable: true
          },

          { /* 9 */
            key: 'vital_st',
            sortable: true
          },

          { /* 10 */
            key: 'tos',
            label: 'Type of surveillance',
            sortable: true
          },

          { /* 11 */
            key: 'capture_method',
            label: 'Capture method',
            sortable: true
          },

          { /* 12 */
            key: 'location_name',
            label: 'Location',
            sortable: true,
            formatter: function (o) {
              if (typeof o.value === 'object' && o.value.name) {
                return o.value.name;
              }
              return o.value;
            }
          }
        ],

        data: sampleList,
        scrollable: 'x',
        sortable: true,
        width: Y.one('#samples').getComputedStyle('width'),
        sortBy: [{date: 1}],

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

        highlightMode: 'row',
        selectionMode: 'row',
        selectionMulti: false
      }; // tableConfig

      Y.on('domready', Y.bind(function () {
        var self = this;

        if (this.editable) {
          tableConfig.editable = true;
          tableConfig.editOpenType = 'dblclick';
          Y.one('.samples-controls').setStyle('display', 'block');
        }

        noteHeader = new Y.Overlay({
          srcNode: "#note-overlay-header",
          zIndex: 10,
          visible: false
        });
        //.plug(Y.Plugin.WidgetAnim);
        //noteHeader.anim.get('animHide').set('duration', 0.01);
        //noteHeader.anim.get('animShow').set('duration', 0.3);
        noteHeader.render();

        noteBody = new Y.Overlay({
          srcNode: "#note-overlay-body",
          zIndex: 10,
          visible: false
        });
        // .plug(Y.Plugin.WidgetAnim);
        // noteBody.anim.get('animHide').set('duration', 0.01);
        // noteBody.anim.get('animShow').set('duration', 0.3);
        noteBody.render();

        // Get the list of autocomplete options
        mp.invoke('autocomplete', null, function (err, data) {
          if (err) {
            Y.log('server transaction error: ' + err, 'error', 'Samples binder');
          } else {
            acOptions = Y.JSON.parse(data);

            tableConfig.columns[1].editor = 'text'; // emc_id

            Y.mix(tableConfig.columns[2], { // date
              editor: 'date',
              editorConfig: {
                dateFormat: '%Y-%m-%d',
                on: {
                  editorShow: function (e) {
                    e.inputNode.focus();
                  }
                }
              },
              prepFn: function (v) {
                var dfmt = "%Y-%m-%d";
                return Y.DataType.Date.format(v, {format: dfmt});
              }
            });

            Y.mix(tableConfig.columns[3], { // type
              // editor: 'select',
              // editorConfig: {
              //   selectOptions: acOptions.type,
              //   activateFirstItem: true,
              //   on: {
              //     editorShow: function (e) {
              //       // Weird. There is no e.inputNode.
              //       Y.one('select.myselect').focus();
              //     }
              //   }
              // }
              editor: 'autocomplete',
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
            });

            Y.mix(tableConfig.columns[4], { // bird
              editor: 'birdAC',
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
              }
            });

            Y.mix(tableConfig.columns[5], { // age
              editor: 'autocomplete',
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
            });

            Y.mix(tableConfig.columns[6], { // sex
              editor: 'autocomplete',
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
            });

            tableConfig.columns[7].editor = 'text'; // ring

            Y.mix(tableConfig.columns[8], { // clin_st
              editor: 'autocomplete',
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
            });

            Y.mix(tableConfig.columns[9], { // vital_st
              editor: 'autocomplete',
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
            });

            Y.mix(tableConfig.columns[10], { // tos
              editor: 'autocomplete',
              editorConfig: {
                autocompleteConfig: {
                  minQueryLength: 0,
                  activateFirstItem: true,
                  source: acOptions.tos,
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
            });

            Y.mix(tableConfig.columns[11], { // capture_method
              editor: 'autocomplete',
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
            });

            Y.mix(tableConfig.columns[12], { // location_name
              editor: 'locationAC',
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
                      this.editor.saveEditor(e.result.raw);
                    }
                  }
                }
              }
            });

            table = new Y.DataTable(tableConfig);

            table[sizeSyncMethod] = function () {
              return false;
            };

            Y.one('#samples-table').empty(); // remove the "Loading" message
            table.render('#samples-table');
            table.processPageRequest(1);

            table.on('selection', function (e) {
              mp.pageData.set('sample',  e.rows[0].record.get('id'));
              mp.broadcast('row-selected', {row: e.rows[0]});
              if (self.editable) {
                Y.one('#delete-sample').set('disabled', false);
              }
            });

            table.on('pageUpdate', function (e) {
              if (self.editable) {
                // Updates lose selection
                Y.one('#delete-sample').set('disabled', true);
              }
            });

            if (self.editable) {
              // Enable/disable the Add button
              Y.one('#new-sample-id').on('keyup', function (e) {
                if (Y.one('#new-sample-id').get('value').match(/^ *$/)) {
                  Y.one('#add-sample').set('disabled', true);
                } else {
                  Y.one('#add-sample').set('disabled', false);
                }
              });

              // Subscribe insert() to Add button and to enter key
              Y.one('#new-sample-id').on('key', function () {
                self.insert();
              }, 'enter');
              Y.one('#add-sample').on('click', function () {
                self.insert();
              });

              // Delete listener
              Y.one('#delete-sample').on('click', function () {
                var
                  row = table.get('selectedRows')[0],
                  id = row.record.get('id'),
                  index = row.recordIndex,
                  options = {
                    params: {
                      body: {
                        id: id
                      }
                    },
                    rpc: true
                  };

                self.mojitProxy.invoke('delete', options, function (err, data) {
                  if (err) {
                    Y.log(err);
                    alert('server transaction error: ' + err);
                  } else {
                    // This makes SampleDetails collapse
                    mp.broadcast('row-deleted', {id: id});

                    Y.log('removing index: ' + index);
                    sampleList.remove(index);

                    // Row deletion loses selection
                    Y.one('#delete-sample').set('disabled', true);
                  }
                });
              }); // on delete
            } // if editable

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
                Y.log(newVal);
                Y.log(['testing', newVal.common_name, e.prevVal]);
                Y.log('Editor: ' + e.editorName + ' in sample ' + id + ' saved newVal=' + newVal.common_name + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
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
                Y.log('invoke update 1');
                mp.invoke('update', options, function (err, data) {
                  if (err) {
                    Y.log('update 1 failed');
                  } else {
                    Y.log('update 1 successful');
                  }
                });
              }
              else if (e.colKey === 'location_name' && newVal.name) {
                Y.log(['testing', newVal.name, e.prevVal]);
                Y.log('Editor: ' + e.editorName + ' in sample ' + id + ' saved newVal=' + newVal.name + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
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
                Y.log('invoke update 2');
                mp.invoke('update', options, function (err, data) {
                  if (err) {
                    Y.log('update 2 failed');
                  } else {
                    Y.log('update 2 successful');
                  }
                });
              }
              else {
                Y.log(['testing', newVal, e.prevVal]);
                Y.log('Editor: ' + e.editorName + ' in sample ' + id + ' saved newVal=' + newVal + ' oldVal=' + e.prevVal + ' colKey=' + e.colKey);
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
                  Y.log('invoke update 3');
                  mp.invoke('update', options, function (err, data) {
                    if (err) {
                      Y.log('update 3 failed');
                    } else {
                      Y.log('update 3 successful');
                    }
                  });
                }
              }
            });

            // Mark annotated data cells
            table.data.after('load', function (e) {
              var notes = e.details[0].response.notes;
              Y.each(notes, function (attrNotes, id) {
                var
                  key = (attrNotes.attr === 'species') ? 'bird' : attrNotes.attr, // Data comes from a view, so species becomes bird
                  record = table.getRecord(id),
                  cell = table.getRow(record).one('.yui3-datatable-col-' + key),
                  text = [];

                Y.each(attrNotes.list, function (note) {
                  text.push(note.text);
                });

                cell.addClass('annotated');
                cell.annotated = true;
                cell.note = text.join('; ');
              });
            });

          } // got autocomplete options
        }); // invoke autocomplete data
      }, this)); // on domready

      // Show annotation button or annotation text (if available) on mouseenter
      Y.one('#samples-table').delegate('mousedown', function (e) {
        var
          target = e.currentTarget,
          cellIndex = target.getDOMNode().cellIndex;

        if (e.shiftKey && !noteEditorShown) {
          // While it's still hidden, center the noteHeader over the cell
          Y.one('#note-overlay-header').setStyle('opacity', '0');
          Y.one('#note-overlay-body').setStyle('opacity', '0');
          noteHeader.set(
            'width',
            parseInt(target.getComputedStyle('border-left-width'), 10) +
            parseInt(target.getComputedStyle('padding-left'), 10) +
            parseInt(target.getComputedStyle('width'), 10) +
            parseInt(target.getComputedStyle('padding-right'), 10) +
            parseInt(target.getComputedStyle('border-right-width'), 10)
          );
          noteHeader.set(
            'height',
            parseInt(target.getComputedStyle('border-top-width'), 10) +
            parseInt(target.getComputedStyle('padding-top'), 10) +
            parseInt(target.getComputedStyle('height'), 10) +
            parseInt(target.getComputedStyle('padding-bottom'), 10) +
            parseInt(target.getComputedStyle('border-bottom-width'), 10)
          );
          noteHeader.set("centered", target);

          // Set content
          if (target.annotated) {
            Y.log('this cell is annotated');
            Y.log(target.note);
            noteBody.setStdModContent('body', target.getAttribute('note-text'));
            noteBody.set('width', '300px');
            noteBody.set('height', '200px');
            noteBody.set("align", {
              node: noteHeader.get('contentBox'),
              points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
            });
          }
          else {
            Y.log('not annotated');
          }

          Y.one('#note-overlay-header').setStyle('opacity', '0.5');
          Y.one('#note-overlay-body').setStyle('opacity', '1');
          noteHeader.show();
          noteBody.show();
          noteEditorShown = true;
        }
      }, 'td');

      keyUpListener = function (e) {
        if (noteEditorShown) {
          noteHeader.hide();
          noteBody.hide();
          noteEditorShown = false;
        }
      };

      Y.one('document').on('key', keyUpListener, 'esc');

      // Refresh the content when user clicks refresh button.
      Y.one('#samples').delegate('click', function (e) {
        e.halt();
        table.processPageRequest(table.pagModel.get('page'));
      }, 'a.refresh');

      Y.on('windowresize', function (e) {
        table.set('width', Y.one('#samples').getComputedStyle('width'));
      });
    }, // bind()

    // insert a new sample
    insert: function () {
      var
        self = this,
        id = Y.Lang.trim(Y.one('#new-sample-id').get('value')),
        options = {
          params: {
            body: {
              id: id
            }
          },
          rpc: true
        };

      this.mojitProxy.invoke('find', options, function (err, data) {
        if (err) {
          Y.log(err);
          alert('server transaction error: ' + err);
        } else {
          if (data.rowCount === 0) {
            self.mojitProxy.invoke('create', options, function (err, data) {
              if (err) {
                Y.log('create failed: ' + err);
              } else {
                // The create() method seems to be a better alternative to the above,
                // but it does not work. It creates empty rows and does not sync.
                sampleList.remove(0);
                sampleList.add(
                  [{
                    id: id,
                    emc_id: '',
                    date: '',
                    type: '',
                    bird: '',
                    age: '',
                    sex: '',
                    ring: '',
                    clin_st: '',
                    vital_st: '',
                    capture_method: '',
                    location: '',
                    location_name: ''
                  }],
                  {
                    index: sampleList.get('id').length // Getting ids just to see how many rows are there
                  }
                );
                // table.set('selectedRows', [0]); // (!) only because the row gets inserted at the top postion by default
                Y.one('#new-sample-id').set('value', '');
                Y.log('create successful');
              }
            });
          } else {
            alert('Sample with this ID already exists: ' + id);
          }
        }
      });
    }
  };
}, '0.0.1', {
  requires: [
    'autocomplete',
    'autocomplete-highlighters',
    'event-mouseenter',
    'event-key',
    'mojito-client',
    'mojito-data-addon',
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
    'gallery-datatable-celleditor-popup',
    'gallery-datatable-paginator',
    'gallery-paginator-view',
    'overlay',
    'widget-anim'
  ]
});
