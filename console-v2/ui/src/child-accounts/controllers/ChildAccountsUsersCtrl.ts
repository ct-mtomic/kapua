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
export default class UsersListCtrl {
    private users: User[];
    private refreshList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $filter: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private $stateParams: angular.ui.IStateParamsService,
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
                header: "Status",
                itemField: "status",
                templateFn: function (value) {
                    var style = value === "ENABLED" ? '29,158,116' : '255,0,0';
                    return '<i class="fa fa-user" style="color: rgb(' + style + '); padding-top: 4px;"</i>';
                }
            },
            {
                header: "Name",
                itemField: "name"
            },
            {
                header: "Display Name",
                itemField: "displayName"
            },
            {
                header: "Phone Number",
                itemField: "phoneNumber"
            },
            {
                header: "Email",
                itemField: "email"
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

            if (filter.id === 'status') {
                match = item.status === filter.value;
            } else if (filter.id === 'name') {
                match = item.name.match(filter.value) !== null;
            } else if (filter.id === 'displayName') {
                match = item.displayName.match(filter.value);
            } else if (filter.id === 'phoneNumber') {
                match = item.phoneNumber.match(filter.value) !== null;
            } else if (filter.id === 'email') {
                match = item.email.match(filter.value);
            } else if (filter.id === 'createdOn') {
                match = item.createdOn.match(filter.value);
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
                selectedItems.forEach((item: User) => {
                    selected.push(item.id);
                });
                let modal = $modal.open({
                    template: require("../views/child-accounts-details/delete-users-modal.html"),
                    controller: "DeleteAccountUsersModalCtrl as vm",
                    resolve: {
                        childAccountID: () => $stateParams["id"],
                        ids: () => selected,
                        refreshUserList: () => $scope.refreshList
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
                template: require("../views/child-accounts-details/delete-users-modal.html"),
                controller: "DeleteAccountUsersModalCtrl as vm",
                resolve: {
                    childAccountID: () => $stateParams["id"],
                    ids: () => selected,
                    refreshUserList: () => $scope.refreshList
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
                template: require("../views/child-accounts-details/add-user-modal.html"),
                controller: "AddAccountUserModalCtrl as vm",
                resolve: {
                    childAccountID: () => $stateParams["id"],
                    editUserID: () => undefined,
                    refreshUserList: () => $scope.refreshList
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
                template: require("../views/child-accounts-details/add-user-modal.html"),
                controller: "AddAccountUserModalCtrl as vm",
                resolve: {
                    childAccountID: () => $stateParams["id"],
                    editUserID: () => item.id,
                    refreshUserList: () => $scope.refreshList
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

        $scope.filterConfig = {
            fields: [
                {
                    id: 'status',
                    title: 'Status',
                    placeholder: 'Filter by Status...',
                    filterType: 'select',
                    filterValues: ['ENABLED', 'DISABLED']
                },
                {
                    id: 'name',
                    title: 'Name',
                    placeholder: 'Filter by Name...',
                    filterType: 'text'
                },
                {
                    id: 'displayName',
                    title: 'Display Name',
                    placeholder: 'Filter by Display Name...',
                    filterType: 'text'
                },
                {
                    id: 'phoneNumber',
                    title: 'Phone Number',
                    placeholder: 'Filter by Phone Number...',
                    filterType: 'text'
                },
                {
                    id: 'email',
                    title: 'Email',
                    placeholder: 'Filter by Email...',
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
                    name: 'Add User',
                    title: 'Add new user',
                    actionFn: addItem
                },
                {
                    name: 'Delete Users',
                    title: 'Delete selected users',
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
                name: 'Delete',
                title: 'Delete user',
                actionFn: deleteItem
            }
        ];

        $scope.tableMenuActions = [
            {
                name: 'Edit',
                title: 'Edit user',
                actionFn: editItem
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
                childAccountsService.getUsers().then((result: ng.IHttpPromiseCallbackArg<ListResult<User>>) => {
                    $scope.allItems = result.data.items.item;
                    $scope.items = $scope.allItems;
                    $scope.tableConfig.itemsAvailable = $scope.allItems.length ? true : false;
                    $scope.updateItemsAvailable();
                });
                $scope.showComponent = true
            }, 500);
        };
    }
}