'use strict';
(function(){
   var app = angular.module('CassandraWorkbenchApp');

   app.controller('MainController', function ($scope, $http, ngDialog) {
       var self = this;

        var currentNode = null;

        var nodeType = {
            contactPoint: 'contactPoint', 
            keyspace: 'keyspace',
            columnfamily: 'columnfamily',
            column: 'column'
        };

        self.currentContactPoint = '';
        self.currentKeyspace = '';
        self.query = '';
        self.canWriteQuery = false;
        self.errorHeader = '';
        self.errorBody = '';
        self.queryResult = [];
        self.queryResultColumns = [];

        var setCurrentNode = function(node){
            currentNode = node;
            var parentList = node.getParentList();
            for(var i in parentList){
                var parent = parentList[i];
                if(parent.data.type === nodeType.contactPoint){
                    self.currentContactPoint = parent.title;
                    self.currentKeyspace = 'system';
                }
                if(parent.data.type === nodeType.keyspace){
                    self.currentKeyspace = parent.title;
                }
            }
            
            self.canWriteQuery = self.currentKeyspace.length > 0;
            $scope.$apply();
        };

        var tree = null;

        $('#connectionTree').fancytree({
            extensions: ['dnd'],
            source: [],
            lazyLoad: function (event, data) {
                var node = data.node;

                switch (node.data.type) {
                    case nodeType.contactPoint:
                        data.result = {
                            type: 'GET',
                            url: '/api/contactPoints',
                            data: {
                                contactPoint: node.data.contactPoint
                            },
                            dataType: 'json'
                        };
                        break;
                    case nodeType.keyspace:
                        data.result = {
                            type: 'GET',
                            url: '/api/contactPoints/keyspaces',
                            data: {
                                contactPoint: node.data.contactPoint,
                                keyspace: node.data.keyspace
                            },
                            dataType: 'json'
                        };
                        break;
                    case nodeType.columnfamily:
                        data.result = {
                            type: 'GET',
                            url: '/api/contactPoints/keyspaces/columnfamilies',
                            data: {
                                contactPoint: node.data.contactPoint,
                                keyspace: node.data.keyspace,
                                columnfamily: node.data.columnfamily
                            },
                            dataType: 'json'
                        };
                        break;
                    default:
                        data.result = [];
                        break;
                }
            },
            postProcess: function(event, data) {
                /*
                var orgResponse = data.response;
                if( orgResponse.status === "ok" ) {
                    data.result = orgResponse.result;
                } else {
                    // Signal error condition to tree loader
                    data.result = {
                        error: "ERROR #" + orgResponse.faultCode + ": " + orgResponse.faultMsg
                    }
                }
                //*/
                //data.result = [{title: "Node created by postProcess"}];
            },
            renderNode: function (event, data) {
                var node = data.node;

                switch (node.data.type) {
                    case nodeType.contactPoint:
                        $('.fancytree-icon', node.span).addClass('glyphicon glyphicon-th-list');
                        break;
                    case nodeType.keyspace:
                        $('.fancytree-icon', node.span).addClass('glyphicon glyphicon-hdd');
                        break;
                    case nodeType.columnfamily:
                        $('.fancytree-icon', node.span).addClass('glyphicon glyphicon-list-alt');
                        break;
                    case nodeType.column:
                        $('.fancytree-icon', node.span).addClass('glyphicon glyphicon-book');
                        break;
                    default:
                        $('.fancytree-icon', node.span).addClass('glyphicon glyphicon-question-sign');
                        break;
                }
            },
            click: function (event, data) {
                var node = data.node;
                setCurrentNode(node);
            },
            dnd: {
                draggable: { // modify default jQuery draggable options
                  zIndex: 1000,
                  scroll: false,
                  revert: "invalid",
                  appendTo: "body", // Helper parent (defaults to tree.$container)
                  helper: function(event) {
                    var $helper,
                      sourceNode = $.ui.fancytree.getNode(event.target),
                      $nodeTag = $(sourceNode.span);

                    $helper = $("<div class='fancytree-drag-helper'><span class='fancytree-drag-helper-img' /></div>")
                      .append($nodeTag.find("span.fancytree-title").clone());

                    // Attach node reference to helper object
                    $helper.data("ftSourceNode", sourceNode);
                    // we return an unconnected element, so `draggable` will add this
                    // to the parent specified as `appendTo` option
                    return $helper;
                  }
                },
                preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
                preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
                dragStart: function(node, data) {
                    // This function MUST be defined to enable dragging for the tree.
                    // Return false to cancel dragging of node.
                    if(node.data.type === nodeType.column){
                        return false;
                    }        
                    return true;
                }
              }
        });

        tree = $('#connectionTree').fancytree('getTree');

        self.openAddConnectionDialog = function () {
            $scope.contactPoint = '127.0.0.1';

            var dialog = ngDialog.open({
                template: 'app/dialog/dialog.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
				preCloseCallback: function(dialogResult) {

                    if(!dialogResult || dialogResult === '$closeButton'){
                        // close dialog
                        return false;
                    }

                    $(dialogResult.warnElementId).hide();
                    $(dialogResult.errorElementId).hide();

                    for (var i in tree.rootNode.children) {
                        var contactNode = tree.rootNode.children[i];

                        if (contactNode.title === dialogResult.contactPoint) {
                            $(dialogResult.warnElementId).show();
                            return true;
                        }
                    }

                    $http.get('/api/contactPoints?contactPoint=' + dialogResult.contactPoint)
                    
                        .success(function (keyspaces) {
                            
                            var connectionNode = tree.rootNode.addNode({
                                title: dialogResult.contactPoint,
                                type: 'contactPoint',
                                contactPoint: dialogResult.contactPoint,
                                lazy: false,
                                key: 1
                            });

                            connectionNode.addChildren(keyspaces);

                            connectionNode.setExpanded(true);

                            connectionNode.setSelected(true);
                            
                            dialog.close();
                            //return true;

                        })
                        .error(function () { // err
                        //self.error = err;

                        $(dialogResult.errorElementId).show();
                        //return false
                    });
                    
                    return true;
				}
            });
        };

        self.executeQuery = function () {

            $http.post('/api/contactPoints/keyspaces/queries', { contactPoint: self.currentContactPoint, keyspace: self.currentKeyspace, query: self.query }).
                success(function (data) {
                    if (data.rows) {

                        $('#queryErrorMessage').hide();

                        if(data.rows.length > 0){
                            self.queryResultColumns = Object.keys(data.rows[0]);
                        }else{
                            self.queryResultColumns = [];
                        }

                        self.queryResult = data.rows;


                    } else {
                        self.errorHeader = data.name;
                        self.errorBody = data.message;

                        $('#queryErrorMessage').show();
                        self.queryResult = [];
                        self.queryResultColumns = [];
                    }
                    
                }).
                error(function (err) {
                    self.errorHeader = 'Error';
                    self.errorBody = err;
                });
        };

        var oldCurrentNode = null;
        var oldQuery = null;

         $(".droppable").droppable({
            hoverClass: "drop-hover",
			drop: function(event, ui){
				//var node = $(ui.helper).data("ftSourceNode");
                self.executeQuery();
			},
            over: function( event, ui ) {
                var node = $(ui.helper).data("ftSourceNode");

                oldCurrentNode = currentNode;
                oldQuery = self.query;

                switch(node.data.type){
                    case nodeType.contactPoint:
                        self.query = 'SELECT * FROM schema_keyspaces';
                    break;
                    case nodeType.keyspace:
                        self.query = 'SELECT * FROM schema_columnfamilies WHERE keyspace_name = ' + node.title;
                    break;
                    case nodeType.columnfamily:
                        self.query = 'SELECT * FROM ' + node.title;
                    break;
                    default:
                    break;
                }

                setCurrentNode(node);
            },
            out: function( event, ui ) {
                
                if(!oldCurrentNode){
                    oldCurrentNode = $(ui.helper).data("ftSourceNode");
                }
                self.query = oldQuery;
                setCurrentNode(oldCurrentNode);
            }
		});

        self.openAddConnectionDialog();
   });
})();
