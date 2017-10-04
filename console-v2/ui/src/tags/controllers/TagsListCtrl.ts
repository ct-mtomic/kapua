/*******************************************************************************
* Copyright (c) 2016, 2017 Eurotech and/or its affiliates                       
*                                                                               
* All rights reserved. This program and the accompanying materials              
* are made available under the terms of the Eclipse Public License v1.0         
* which accompanies this distribution, and is available at                      
* http://www.eclipse.org/legal/epl-v10.html                                     
*                                                                               
* Contributors:                                                                 
*     Eurotech - initial API and implementation                                 
*                                                                               
*******************************************************************************/

export default class TagsListCtrl {
    private tags: Tag[];
    private refreshList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $filter: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private tagsService: ITagsService) {

        $scope.allItems = [];
        $scope.items = [];

        $scope.$watch(
            () => { return $scope.refreshList; },
            () => {
                $scope.updateItems();
            });

        $scope.columns = [
            {
                header: "Tag Name",
                itemField: "name"
            },
            {
                header: "Created By",
                itemField: "createdBy"
            },
            {
                header: "Created On",
                itemField: "createdOn"
            }
        ];

        $scope.pageConfig = {
            pageNumber: 1,
            pageSize: 5,
            pageSizeIncrements: [5, 10, 15]
        }

        var matchesFilter = function (item, filter) {
            var match = true;

            if (filter.id === 'name') {
                match = item.name.match(filter.value) !== null;
            } else if (filter.id === 'createdBy') {
                match = item.createdBy.match(filter.value);
            } else if (filter.id === 'createdOn') {
                match = item.createdOn.match(filter.value) !== null;
            }
            return match;
        };

        var matchesFilters = function (item, filters) {
            var matches = true;

            filters.forEach(function (filter) {
                if (!matchesFilter(item, filter)) {
                    matches = false;
                    return false;
                }
            });
            return matches;
        };

        var applyFilters = function (filters) {
            $scope.items = [];
            if (filters && filters.length > 0) {
                $scope.allItems.forEach(function (item) {
                    if (matchesFilters(item, filters)) {
                        $scope.items.push(item);
                    }
                });
            } else {
                $scope.items = $scope.allItems;
            }
        };

        var filterChange = function (filters) {
            applyFilters(filters);
            $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
        };

        var deleteItems = function (action) {
            let selected: string[] = [];
            var selectedItems = $filter('filter')($scope.allItems, { selected: true });
            if (selectedItems.length) {
                selectedItems.forEach((item: Tag) => {
                    selected.push(item.id);
                });
                let modal = $modal.open({
                    template: require("../views/delete-tags-modal.html"),
                    controller: "DeleteTagsModalCtrl as vm",
                    resolve: {
                        ids: () => selected,
                        refreshTagList: () => $scope.refreshList
                    }
                });
                modal.result.then((result: any) => {
                    $scope.refreshList = result;
                    $scope.toolbarActionsConfig.primaryActions[1].isDisabled = true;
                },
                    (result) => {
                        console.warn(result);
                    });
            }
        };

        var deleteItem = function (action, item) {
            let selected: string[] = [];
            selected.push(item.id);
            let modal = $modal.open({
                template: require("../views/delete-tags-modal.html"),
                controller: "DeleteTagsModalCtrl as vm",
                resolve: {
                    ids: () => selected,
                    refreshTagList: () => $scope.refreshList
                }
            });
            modal.result.then((result: any) => {
                $scope.refreshList = result;
                $scope.toolbarActionsConfig.primaryActions[1].isDisabled = true;
            },
                (result) => {
                    console.warn(result);
                });
        };

        var addItem = function (action) {
            let modal = $modal.open({
                template: require("../views/add-tag-modal.html"),
                controller: "AddTagModalCtrl as vm",
                resolve: {
                    editTagID: () => undefined,
                    refreshTagList: () => $scope.refreshList
                }
            });
            modal.result.then((result: any) => {
                $scope.refreshList = result;
            },
                (result) => {
                    console.warn(result);
                });
        }

        var editItem = function (action, item) {
            let modal = $modal.open({
                template: require("../views/add-tag-modal.html"),
                controller: "AddTagModalCtrl as vm",
                resolve: {
                    editTagID: () => item.id,
                    refreshTagList: () => $scope.refreshList
                }
            });
            modal.result.then((result: any) => {
                $scope.refreshList = result;
            },
                (result) => {
                    console.warn(result);
                });
        }

        function handleCheckBoxChange(item?) {
            var selectedItems = $filter('filter')($scope.allItems, { selected: true });
            if (selectedItems) {
                $scope.toolbarConfig.filterConfig.selectedCount = selectedItems.length;
            }
            $scope.isItemsSelected();
        }

        var viewDetails = function (action, item) {
            $state.go("kapua.tags.detail", { id: item.id });
        }

        $scope.filterConfig = {
            fields: [
                {
                    id: 'name',
                    title: 'Tag Name',
                    placeholder: 'Filter by Tag Name...',
                    filterType: 'text'
                },
                {
                    id: 'createdBy',
                    title: 'Created By',
                    placeholder: 'Filter by Created By...',
                    filterType: 'text'
                },
                {
                    id: 'createdOn',
                    title: 'Created On',
                    placeholder: 'Filter by Created On...',
                    filterType: 'text'
                }
            ],
            resultsCount: $scope.items.length,
            totalCount: $scope.allItems.length,
            appliedFilters: [],
            onFilterChange: filterChange
        };

        $scope.toolbarActionsConfig = {
            primaryActions: [
                {
                    name: 'Add Tag',
                    title: 'Add new Tag',
                    actionFn: addItem
                },
                {
                    name: 'Delete Tags',
                    title: 'Delete selected Tags',
                    actionFn: deleteItems,
                    isDisabled: true
                }
            ],
            actionsInclude: true
        };

        $scope.toolbarConfig = {
            filterConfig: $scope.filterConfig,
            sortConfig: $scope.sortConfig,
            actionsConfig: $scope.toolbarActionsConfig,
            isTableView: true
        };

        $scope.tableConfig = {
            onCheckBoxChange: handleCheckBoxChange,
            selectionMatchProp: "name",
            itemsAvailable: true,
            showCheckboxes: true
        };

        $scope.emptyStateConfig = {
            icon: 'pficon-warning-triangle-o',
            title: 'No Items Available'
        };

        $scope.tableActionButtons = [
            {
                name: 'View',
                title: 'View tag details',
                actionFn: viewDetails
            }
        ];

        $scope.tableMenuActions = [
            {
                name: 'Edit',
                title: 'Edit Tag',
                actionFn: editItem
            },
            {
                name: 'Delete',
                title: 'Delete Tag',
                actionFn: deleteItem
            }
        ];

        $scope.updateItemsAvailable = function () {
            if (!$scope.tableConfig.itemsAvailable) {
                $scope.toolbarConfig.filterConfig.resultsCount = 0;
                $scope.toolbarConfig.filterConfig.totalCount = 0;
                $scope.toolbarConfig.filterConfig.selectedCount = 0;
            } else {
                $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
                $scope.toolbarConfig.filterConfig.totalCount = $scope.allItems.length;
                handleCheckBoxChange();
            }
        };

        $scope.isItemsSelected = function () {
            $scope.toolbarActionsConfig.primaryActions[1].isDisabled = true;
            var selectedItems = $filter('filter')($scope.allItems, { selected: true });
            if (selectedItems.length) {
                $scope.toolbarActionsConfig.primaryActions[1].isDisabled = false;
            }
        }

        $scope.showComponent = true;

        $scope.updateItems = function () {
            $scope.showComponent = false;
            $timeout(() => {
                // tagsService.getTags().then((result: ng.IHttpPromiseCallbackArg<ListResult<Tag>>) => {
                // $scope.allItems = result.data.items.item;
                $scope.allItems = [ // to be removed
                    {
                        id: "1",
                        name: "Tag 1",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    },
                    {
                        id: "2",
                        name: "Tag 2",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    },
                    {
                        id: "3",
                        name: "Tag 3",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    },
                    {
                        id: "4",
                        name: "Tag 4",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    },
                    {
                        id: "5",
                        name: "Tag 5",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    },
                    {
                        id: "6",
                        name: "Tag 6",
                        createdBy: "ADMIN",
                        createdOn: "08/23/2017",
                        modifiedBy: "ADMIN",
                        modifiedOn: "08/23/2017"
                    }
                ];

                $scope.items = $scope.allItems;
                $scope.tableConfig.itemsAvailable = $scope.allItems.length ? true : false;
                $scope.updateItemsAvailable();
                // });
                $scope.showComponent = true
            }, 500);
        };
    }
}