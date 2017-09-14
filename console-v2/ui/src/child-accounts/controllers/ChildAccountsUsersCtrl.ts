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
    private refreshUserList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private $stateParams: angular.ui.IStateParamsService,
        private childAccountsService: IChildAccountsService) {

        $scope.$watch(
            () => { return this.refreshUserList; },
            () => {
                $timeout(function () {
                    childAccountsService.getUsers().then((result: ng.IHttpPromiseCallbackArg<ListResult<User>>) => {
                        $(() => {
                            $scope.users = result.data.items.item;
                            // DataTable Config
                            $("#table1").dataTable().fnDestroy();
                            $("#table1").dataTable({
                                columns: [
                                    {
                                        data: null,
                                        className: "table-view-pf-select checkboxField",
                                        render: function (data, type, full, meta) {
                                            // Select row checkbox renderer
                                            let id = "select" + data.id;
                                            return `<label class="sr-only" for="` + id + `">Select row ` + meta.row +
                                                `</label><input type="checkbox" id="` + id + `" name="` + id + `">`;
                                        },
                                        sortable: false,
                                        width: "10px"
                                    },
                                    {
                                        data: "status",
                                        render: function (data, type, full, meta) {
                                            return data === 'ENABLED' ? `<i class="fa fa-user" style="color: rgb(29,158,116); padding-top: 4px;"></i>` :
                                                `<i class="fa fa-plug" style="color: rgb(255,0,0); padding-top: 4px;"></i>`;
                                        },
                                        width: "5%",
                                    },
                                    {
                                        data: "name",
                                        width: "22%",
                                    },
                                    {
                                        data: "displayName",
                                        width: "23%",
                                    },
                                    {
                                        data: "phoneNumber",
                                        width: "10%",
                                    },
                                    {
                                        data: "email",
                                        width: "20%",
                                    },
                                    {
                                        data: "createdOn"
                                    },
                                ],
                                pageLength: 500,
                                data: $scope.users,
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

                                $(".checkBoxField").on('click', function () {
                                    let data: any = table.row(this).data();
                                    if (data) {
                                        if (!$('#select' + data.id).is(':focus')) {
                                            $('#select' + data.id).focus();
                                            $('#select' + data.id).click();
                                        }
                                        let selected: number = 0;
                                        $scope.users.forEach((user: User) => {
                                            let rawCheckbox: any = $('#select' + user.id)[0];
                                            rawCheckbox.checked ? selected++ : null;
                                        });
                                        $scope.$apply();
                                        let allCheckbox: any = $('#selectAll')[0];
                                        selected === $scope.users.length ? allCheckbox.checked = true : allCheckbox.checked = false;
                                    } else {
                                        if (!$('#selectAll').is(':focus')) {
                                            $('#selectAll').focus();
                                            $('#selectAll').click();
                                        }
                                        $scope.users.forEach((user: User) => {
                                            let rawCheckbox: any = $('#select' + user.id)[0];
                                            let allCheckbox: any = $('#selectAll')[0];
                                            rawCheckbox.checked = allCheckbox.checked;
                                        });

                                        let selected: number = 0;
                                        $scope.users.forEach((user: User) => {
                                            let rawCheckbox: any = $('#select' + user.id)[0];
                                            rawCheckbox.checked ? selected++ : null;
                                        });
                                        $scope.$apply();
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

    getSelectedUsers(): string[] {
        let selected: string[] = [];
        if (this.$scope.users)
            this.$scope.users.forEach((user: User) => {
                let rawCheckbox: any = $('#select' + user.id)[0];
                if (rawCheckbox.checked == true)
                    selected.push(user.id);
            });
        return selected;
    }

    deleteUsers() {
        let modal = this.$modal.open({
            template: require("../views/child-accounts-details/delete-users-modal.html"),
            controller: "DeleteUsersModalCtrl as vm",
            resolve: {
                childAccountID: () => this.$stateParams["id"],
                ids: () => this.getSelectedUsers(),
                refreshUserList: () => this.refreshUserList
            }
        });
        modal.result.then((result: any) => {
            this.refreshUserList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    addUser() {
        let modal = this.$modal.open({
            template: require("../views/child-accounts-details/add-user-modal.html"),
            controller: "AddUserModalCtrl as vm",
            resolve: {
                childAccountID: () => this.$stateParams["id"],
                editUserID: () => null,
                refreshUserList: () => this.refreshUserList
            }
        });
        modal.result.then((result: any) => {
            this.refreshUserList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    editUser(userID) {
        let modal = this.$modal.open({
            template: require("../views/child-accounts-details/add-user-modal.html"),
            controller: "AddUserModalCtrl as vm",
            resolve: {
                childAccountID: () => this.$stateParams["id"],
                editUserID: () => this.getSelectedUsers()[0],
                refreshUserList: () => this.refreshUserList
            }
        });
        modal.result.then((result: any) => {
            this.refreshUserList = result;
        },
            (result) => {
                console.warn(result);
            });
    }
}