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
    self,
    table,
    Model,
    ModelList,
    modelList,
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
      h9_ct: {},
      ndv_status: {},
      ndv_ct: {}
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
      resultListLocator: 'rows',
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
        'h9_ct',
        'ndv_status',
        'ndv_ct'
      ],
      metaFields: {
        notes: 'notes'
      }
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
                id: mojitProxy.pageData.get('sample')
              }
            }
          };

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
        tableConfig,
        acOptions,
        noteHeader,
        noteBody,
        noteEditorShown = false,
        noteSaveFn,
        attachNotesToCells,
        metaEnterListener,
        closeButtonListener,
        closeNoteEditor = function () {
          metaEnterListener.detach();
          closeButtonListener.detach();
          noteHeader.destroy();
          noteBody.destroy();
          noteEditorShown = false;
        },
        renderTable,
        loadHandler,
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
          if (e.inputNode.get('value') === 'undefined') {
            e.inputNode.set('value', '');
          }
        },
        resetUndefined = function (e) {
          if (e.inputNode.get('value') === 'undefined') {
            e.inputNode.set('value', '');
          }
        };

      sampleID = mp.pageData.get('sample');

      renderTable = Y.bind(function () {
        self = this;
        if (this.editable) {
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
                  editor: 'inline'
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
                  editor: 'inline'
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
                  editor: 'inline'
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
                  label: 'h9 Ct',
                  editor: 'inline'
                },

                {
                  key: 'ndv_status',
                  label: 'NDV Status',
                  editor: 'inlineAC',
                  editorConfig: {
                    autocompleteConfig: {
                      source: acOptions.ndv_status,
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
                  key: 'ndv_ct',
                  label: 'NDV Ct',
                  editor: 'inline'
                }

                // {
                //   key: 'name',
                //   label: 'Name',
                //   editor: 'inline',
                //   editorConfig: {
                //     on: {editorShow: resetUndefined}
                //   }
                // }
              ],

              data: modelList,
              scrollable: 'x',

              editable: true,
              editOpenType: 'dblclick'
            }); // table = new Y.DataTable()


            table.data.load(loadHandler);

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
            }); // after cellEditorSave

            // Mark annotated data cells.
            // This function may end up getting called twice because of the
            // uncertain load/render sequence, but better that than not
            // called at all.
            attachNotesToCells = function (e) {
              Y.each(table.notes, function (attrNotes, attr) {
                var
                  record = table.getRecord(0),
                  columns = table.get('columns'),
                  index = columns.map(function (o) {
                    return o.key;
                  }).indexOf(attr),
                  cell = table.getCell([0, index]);

                cell.addClass('annotated');
                cell.annotated = true;
                cell.id = sampleID;
                cell.attr = attr;
                cell.notes = attrNotes.sort(function (a, b) {
                  return new Date(a.when) - new Date(b.when);
                });
              });
            };

            table.data.after('load', function (e) {
              // This is a kludgy way to attach note data to the table.
              // Once the table has been rendered, there is no access to
              // response details.
              table.notes = e.details[0].response.notes;
              Y.log(['notes adter load', table.notes]);
              attachNotesToCells();
            });

            table.after('render', function (e) {
              Y.log(['notes after render', table.notes]);
              attachNotesToCells();
            });

          }); // invoke autocomplete data
        } // editable by this user
      }, this); // renderTable()

     loadHandler = function () {
       Y.one('#diagnostics-table').empty(); // remove the "Loading" message
       if (table.data.isEmpty()) {
         // No diagnostics record exists; offer a button to create one.
         Y.one('#diagnostics-table').append('<button id="diagnostics-create" type="button">Create</button>');
         createListener = Y.one('#diagnostics-create').on('click', function (e) {
           var options = {
             params: {
               body: {
                 id: mp.pageData.get('sample')
               }
             },
             rpc: true
           };
           mp.invoke('create', options, function (err, data) {
             if (err) {
               Y.log('create failed');
             } else {
               Y.log('create successful');
               sampleID = mp.pageData.get('sample');
               renderTable();
             }
           });
         });
       } // no diagnostics record for this sample
       else {
         table.render('#diagnostics-table');
       }
     };

      Y.on('domready', function () {
        Y.log('domready -> renderTable()');
        renderTable();
      }, this);

      // Show note editor on mouseenter
      Y.one('#diagnostics-table').delegate('mousedown', function (e) {
        var
          target = e.currentTarget,
          listItems = [
            '<li>' +
            '<div class="annotation-text">' +
            '<textarea id="annotation-input" rows="4" autofocus="1" placeholder="Add a note here. Meta+Enter to save, Esc to cancel."></textarea>' +
            '</div>' +
            '<div><button id="annotation-save">Save</button>' +
            '</div>' +
            '</li>'
          ];

        if (e.metaKey || e.shiftKey) {
          if (noteEditorShown) {
            closeNoteEditor();
          }
          // Set content
          if (target.annotated) {
            Y.log('this cell is annotated');
            Y.each(target.notes.reverse(), function (note) {
              note.when = note.when.replace(/T[0-9].+$/, '');
              listItems.unshift(
                '<li>' +
                '<div class="annotation-meta">' +
                  '<span class="annotation-author">' + note.user + '</span> on ' +
                  '<span class="annotation-date">' + note.when + '</span>' +
                '</div>' +
                '<div class="annotation-text">' + note.text + '</div>' +
                '</li>'
              );
            });
          }
          else {
            Y.log('not annotated');
          }

          noteHeader = new Y.Overlay({
            zIndex: 10,
            visible: false
          }).plug(Y.Plugin.WidgetAnim);
          noteHeader.anim.get('animHide').set('duration', 0.01);
          noteHeader.anim.get('animShow').set('duration', 0.3);
          noteHeader.render();

          noteBody = new Y.Overlay({
            zIndex: 10,
            visible: false
          }).plug(Y.Plugin.WidgetAnim);
          noteBody.anim.get('animHide').set('duration', 0.01);
          noteBody.anim.get('animShow').set('duration', 0.3);
          noteBody.setStdModContent('body', '<ul>' + listItems.join('') + '</ul>');
          noteBody.render();

          // While it's still hidden, center the noteHeader over the cell
          noteHeader.get('contentBox').setStyle('opacity', '0');
          noteBody.get('contentBox').setStyle('opacity', '0');
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

          noteBody.set("align", {
            node: noteHeader.get('contentBox'),
            points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
          });

          noteHeader.get('contentBox').setStyle('opacity', '0.5');
          noteBody.get('contentBox').setStyle('opacity', '1');
          noteHeader.show();
          noteBody.show();

          // Without a delay, focus fails to work except
          // for the first time the widget is shown.
          setTimeout(function () {
            Y.one('#annotation-input').focus();
          }, 300);
          noteEditorShown = true;

          // CLose note editor
          noteSaveFn = function (e) {
            e.halt();
            var
              input = Y.one('#annotation-input').get('value').replace(/^\s+|\s+$/g, ''),
              record = table.getRecord(target),
              index = target.getDOMNode().cellIndex,
              attr = table.get('columns')[index].key,
              options;

            e.halt();

            if (input) {
              options = {
                params: {
                  body: {
                    id: sampleID,
                    attr: attr,
                    text: input
                  }
                },
                rpc: true
              };
              self.mojitProxy.invoke('addNote', options, function (err, data) {
                if (err) {
                  Y.log('addNote failed: ' + err);
                } else {
                  Y.log('addNote successful');
                  // refresh
                  table.data.load(function () {
                    table.render('#diagnostics-table');
                  });
                }
              });
            }

            closeNoteEditor();
          };

          metaEnterListener = Y.one('document').on('key', noteSaveFn, 'enter+meta');
          closeButtonListener = Y.one('#annotation-save').on('click', noteSaveFn);
        }
      }, 'td');

      Y.one('document').on('key', function (e) {
        if (noteEditorShown) {
          closeNoteEditor();
        }
      }, 'esc');

      // Refresh the content when user clicks refresh button.
      Y.one('#diagnostics').delegate('click', function (e) {
        e.halt();
        table.data.load(function () {
          if (!table.data.isEmpty()) {
            table.render('#diagnostics-table');
          }
        });
      }, 'a.refresh');

    } // bind()
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
    'cssfonts',
    'cssbutton',
    'dataschema-json',
    'datatable-datasource',
    'datasource-io',
    'datasource-jsonschema',
    'gallery-datatable-selection',
    'gallery-datatable-editable',
    'gallery-datatable-celleditor-inline',
    'overlay',
    'widget-anim'
  ]
});

