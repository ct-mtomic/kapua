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
export default class ChildAccountsListCtrl {
    private childAccounts: ChildAccount[];
    private refreshList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $filter: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private childAccountsService: IChildAccountsService) {

        $scope.allItems = [];
        $scope.items = [];

        $scope.$watch(
            () => { return $scope.refreshList; },
            () => {
                $scope.updateItems();
            });

        $scope.columns = [
            {
                header: "Name",
                itemField: "name"
            },
            {
                header: "Organization Name",
                itemField: "organizationName"
            },
            {
                header: "Email",
                itemField: "email"
            },
            {
                header: "Modified On",
                itemField: "modifiedOn"
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
            } else if (filter.id === 'organizationName') {
                match = item.organizationName.match(filter.value);
            } else if (filter.id === 'email') {
                match = item.email.match(filter.value);
            } else if (filter.id === 'modifiedOn') {
                match = item.modifiedOn.match(filter.value);
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
                selectedItems.forEach((item: ChildAccount) => {
                    selected.push(item.id);
                });
                let modal = $modal.open({
                    template: require("../views/delete-child-accounts-modal.html"),
                    controller: "DeleteChildAccountsModalCtrl as vm",
                    resolve: {
                        ids: () => selected,
                        refreshChildAccountList: () => $scope.refreshList
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
                template: require("../views/delete-child-accounts-modal.html"),
                controller: "DeleteChildAccountsModalCtrl as vm",
                resolve: {
                    ids: () => selected,
                    refreshChildAccountList: () => $scope.refreshList
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
                template: require("../views/add-child-account-modal.html"),
                controller: "AddChildAccountModalCtrl as vm",
                resolve: {
                    editChildAccountID: () => undefined,
                    refreshChildAccountList: () => $scope.refreshList
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
                template: require("../views/add-child-account-modal.html"),
                controller: "AddChildAccountModalCtrl as vm",
                resolve: {
                    editChildAccountID: () => item.id,
                    refreshChildAccountList: () => $scope.refreshList
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
            $state.go("kapua.child-accounts.detail", { id: item.id });
        }

        $scope.filterConfig = {
            fields: [
                {
                    id: 'name',
                    title: 'Name',
                    placeholder: 'Filter by Name...',
                    filterType: 'text'
                },
                {
                    id: 'organizationName',
                    title: 'Organization Name',
                    placeholder: 'Filter by Organization Name...',
                    filterType: 'text'
                },
                {
                    id: 'email',
                    title: 'Email',
                    placeholder: 'Filter by Email...',
                    filterType: 'text'
                },
                {
                    id: 'modifiedOn',
                    title: 'Modified On',
                    placeholder: 'Filter by Modified On...',
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
                    name: 'Add Account',
                    title: 'Add new account',
                    actionFn: addItem
                },
                {
                    name: 'Delete Accounts',
                    title: 'Delete selected accounts',
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
                title: 'View account details',
                actionFn: viewDetails
            }
        ];

        $scope.tableMenuActions = [
            {
                name: 'Edit',
                title: 'Edit account',
                actionFn: editItem
            },
            {
                name: 'Delete',
                title: 'Delete account',
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
                childAccountsService.getChildAccounts().then((result: ng.IHttpPromiseCallbackArg<ListResult<ChildAccount>>) => {
                    $scope.allItems = result.data.items.item;
                    $scope.allItems = [ // to be removed
                        {
                            id: "id1",
                            name: "Acc Name 1",
                            modifiedOn: "2017/09/11",
                            modifiedBy: "admin",
                            createdOn: "2017/09/11",
                            createdBy: "admin",
                            organizationName: "Org Name 1",
                            email: "email@mail.com",
                            referencePerson: "Person 1",
                            phoneNumber: "+ 381 64 454 1032",
                            address1: "Uzice 031",
                            address2: "Cacak 032",
                            postCode: "31000",
                            city: "Uzice",
                            state: "Srbija",
                            country: "Srbija"
                        }
                    ];
                    $scope.items = $scope.allItems;
                    $scope.tableConfig.itemsAvailable = $scope.allItems.length ? true : false;
                    $scope.updateItemsAvailable();
                });
                $scope.showComponent = true
            }, 500);
        };
    }
}