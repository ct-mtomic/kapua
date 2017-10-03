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
export default class ConnectionsListCtrl {
    private connections: Connection[];
    private refreshList: boolean = false;
    constructor(private $scope: any,
        private $timeout: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private connectionsService: IConnectionsService) {

        $scope.allItems = [];
        $scope.items = [];

        $scope.$watch(
            () => { return $scope.refreshList; },
            () => {
                $scope.updateItems();
            });

        $scope.columns = [
            {
                header: "Connection Status",
                itemField: "status",
                templateFn: function (value) {
                    var style = value === "CONNECTED" ? '29,158,116' : '255,0,0';
                    return '<i class="fa fa-plug" style="color: rgb(' + style + '); padding-top: 4px;"</i>';
                }
            },
            {
                header: "Client ID",
                itemField: "clientId"
            },
            {
                header: "User",
                itemField: "userId"
            },
            {
                header: "Protocol",
                itemField: "protocol"
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

            if (filter.id === 'status') {
                match = item.status === filter.value;
            } else if (filter.id === 'clientId') {
                match = item.clientId.match(filter.value) !== null;
            } else if (filter.id === 'userId') {
                match = item.userId.match(filter.value);
            } else if (filter.id === 'protocol') {
                match = item.protocol.match(filter.value) !== null;
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

        var viewDetails = function (action, item) {
            $state.go("kapua.connections.detail", { id: item.id });
        }

        $scope.filterConfig = {
            fields: [
                {
                    id: 'status',
                    title: 'Connection Status',
                    placeholder: 'Filter by Connection Status...',
                    filterType: 'select',
                    filterValues: ['CONNECTED', 'DISCONNECTED']
                },
                {
                    id: 'clientId',
                    title: 'ClientID',
                    placeholder: 'Filter by Client ID...',
                    filterType: 'text'
                },
                {
                    id: 'userId',
                    title: 'User',
                    placeholder: 'Filter by User...',
                    filterType: 'text'
                },
                {
                    id: 'protocol',
                    title: 'Protocol',
                    placeholder: 'Filter by Protocol...',
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

        $scope.toolbarConfig = {
            filterConfig: $scope.filterConfig,
            sortConfig: $scope.sortConfig,
            actionsConfig: $scope.toolbarActionsConfig,
            isTableView: true
        };

        $scope.tableConfig = {
            selectionMatchProp: "userId",
            itemsAvailable: true,
            showCheckboxes: false
        };

        $scope.emptyStateConfig = {
            icon: 'pficon-warning-triangle-o',
            title: 'No Items Available'
        };

        $scope.tableActionButtons = [
            {
                name: 'View',
                title: 'View device details',
                actionFn: viewDetails
            }
        ];

        $scope.updateItemsAvailable = function () {
            if (!$scope.tableConfig.itemsAvailable) {
                $scope.toolbarConfig.filterConfig.resultsCount = 0;
            } else {
                $scope.toolbarConfig.filterConfig.resultsCount = $scope.items.length;
            }
        };

        $scope.showComponent = true;

        $scope.updateItems = function () {
            $scope.showComponent = false;
            $timeout(() => {
                connectionsService.getConnections().then((result: ng.IHttpPromiseCallbackArg<ListResult<Connection>>) => {
                    $scope.allItems = result.data.items.item;
                    $scope.allItems = [ // to be removed
                        {
                            type: "deviceConnection",
                            id: "JDb8eDSZZMA1",
                            scopeId: "AQ",
                            createdOn: "2017-08-09T09:53:26.565Z",
                            createdBy: "Ag",
                            modifiedOn: "2017-08-09T11:29:25.893Z",
                            modifiedBy: "Ag",
                            optlock: 3,
                            status: "CONNECTED",
                            clientId: "B8:27:EB:AC:E3:6C",
                            userId: "Ag1",
                            protocol: "MQTT1",
                            clientIp: "tcp://10.0.2.2:54198"
                        },
                        {
                            type: "deviceConnection",
                            id: "JDb8eDSZZMA2",
                            scopeId: "AQ",
                            createdOn: "2017-08-09T09:53:26.565Z",
                            createdBy: "Ag",
                            modifiedOn: "2017-08-09T11:29:25.893Z",
                            modifiedBy: "Ag",
                            optlock: 3,
                            status: "DISCONNECTED",
                            clientId: "B8:27:EB:AC:E3:6C",
                            userId: "Ag2",
                            protocol: "MQTT2",
                            clientIp: "tcp://10.0.2.2:54198"
                        },
                        {
                            type: "deviceConnection",
                            id: "JDb8eDSZZMA3",
                            scopeId: "AQ",
                            createdOn: "2017-08-09T09:53:26.565Z",
                            createdBy: "Ag",
                            modifiedOn: "2017-08-09T11:29:25.893Z",
                            modifiedBy: "Ag",
                            optlock: 3,
                            status: "CONNECTED",
                            clientId: "B8:27:EB:AC:E3:6C",
                            userId: "Ag3",
                            protocol: "MQTT3",
                            clientIp: "tcp://10.0.2.2:54198"
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