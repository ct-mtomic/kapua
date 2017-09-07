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
    private refreshConnectionList: boolean = false;
    constructor(private $scope: any,
        private $timeout: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private connectionsService: IConnectionsService) {

        $scope.$watch(
            () => { return this.refreshConnectionList; },
            () => {
                $timeout(function () {
                    connectionsService.getConnections().then((result: ng.IHttpPromiseCallbackArg<ListResult<Connection>>) => {
                        $(() => {
                            // $scope.connections = result.data.items.item;
                            $scope.connections = [
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
                            ]
                            // DataTable Config
                            $("#table1").dataTable().fnDestroy();
                            $("#table1").dataTable({
                                columns: [
                                    {
                                        data: "status",
                                        render: function (data, type, full, meta) {
                                            return data === 'CONNECTED' ? `<i class="fa fa-plug" style="color: rgb(29,158,116); padding-top: 4px;"></i>` :
                                                `<i class="fa fa-plug" style="color: rgb(255,0,0); padding-top: 4px;"></i>`;
                                        },
                                        width: "7%"
                                    },
                                    {
                                        data: "clientId",
                                        width: "25%",
                                    },
                                    {
                                        data: "userId",
                                        width: "23%",
                                    },
                                    {
                                        data: "protocol",
                                        width: "23%"
                                    },
                                    {
                                        data: "modifiedOn"
                                    }
                                ],
                                pageLength: 500,
                                data: $scope.connections,
                                dom: "t",
                                language: {
                                    zeroRecords: "No records found"
                                },
                                order: [[1, "asc"]],
                                pfConfig: {
                                    emptyStateSelector: "#emptyState1",
                                    filterCols: [
                                        null,
                                        {
                                            default: true,
                                            optionSelector: "#filter1",
                                            placeholder: "Filter By Rendering Engine..."
                                        }, {
                                            optionSelector: "#filter2",
                                            placeholder: "Filter By Browser..."
                                        }, {
                                            optionSelector: "#filter3",
                                            placeholder: "Filter By Platform(s)..."
                                        }, {
                                            optionSelector: "#filter4",
                                            placeholder: "Filter By Engine Version..."
                                        }, {
                                            optionSelector: "#filter5",
                                            placeholder: "Filter By CSS Grade..."
                                        }
                                    ],
                                    toolbarSelector: "#toolbar1",
                                    selectAllSelector: `th:first-child input[type="checkbox"]`
                                },
                                select: {
                                    selector: `td:first-child input[type="checkbox"]`,
                                    style: "multi"
                                },
                            } as DataTables.Settings);

                            /**
                             * Utility to find items in Table View
                             */
                            let findTableViewUtil = function (config) {
                                // Upon clicking the find button, show the find dropdown content
                                $(".btn-find").click(function () {
                                    $(this).parent().find(".find-pf-dropdown-container").toggle();
                                });

                                // Upon clicking the find close button, hide the find dropdown content
                                $(".btn-find-close").click(function () {
                                    $(".find-pf-dropdown-container").hide();
                                });

                                // Upon clicking on table row
                                let table = $('#table1').DataTable();

                                $('tr').on('click', function () {
                                    let data: any = table.row(this).data();
                                    if (data) {
                                        if (!$("#select" + data.id).is(':focus')) {
                                            $state.go("kapua.connections.detail", { id: data.id });
                                        }
                                    }
                                });
                            };
                            // Initialize find util
                            new findTableViewUtil(null);
                            let dataTable = ($(".datatable") as any).dataTable();
                        });
                    });
                }, 500);
            });
    }

}