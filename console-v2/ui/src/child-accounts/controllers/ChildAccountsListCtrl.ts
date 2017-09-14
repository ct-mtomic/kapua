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
    private refreshChildAccountList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private childAccountsService: IChildAccountsService) {

        $scope.$watch(
            () => { return this.refreshChildAccountList; },
            () => {
                $timeout(function () {
                    childAccountsService.getChildAccounts().then((result: ng.IHttpPromiseCallbackArg<ListResult<ChildAccount>>) => {
                        $(() => {
                            // $scope.childAccounts = result.data.items.item;
                            $scope.childAccounts = [
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
                            ]
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
                                        data: "name",
                                        width: "25%",
                                    },
                                    {
                                        data: "organizationName",
                                        width: "25%",
                                    },
                                    {
                                        data: "email",
                                        width: "25%",
                                    },
                                    {
                                        data: "modifiedOn"
                                    }
                                ],
                                pageLength: 500,
                                data: $scope.childAccounts,
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
                                        $scope.childAccounts.forEach((childAccounts: ChildAccount) => {
                                            let rawCheckbox: any = $('#select' + childAccounts.id)[0];
                                            rawCheckbox.checked ? selected++ : null;
                                        });
                                        $scope.$apply();
                                        let allCheckbox: any = $('#selectAll')[0];
                                        selected === $scope.childAccounts.length ? allCheckbox.checked = true : allCheckbox.checked = false;
                                    } else {
                                        if (!$('#selectAll').is(':focus')) {
                                            $('#selectAll').focus();
                                            $('#selectAll').click();
                                        }
                                        $scope.childAccounts.forEach((childAccounts: ChildAccount) => {
                                            let rawCheckbox: any = $('#select' + childAccounts.id)[0];
                                            let allCheckbox: any = $('#selectAll')[0];
                                            rawCheckbox.checked = allCheckbox.checked;
                                        });

                                        let selected: number = 0;
                                        $scope.childAccounts.forEach((childAccounts: ChildAccount) => {
                                            let rawCheckbox: any = $('#select' + childAccounts.id)[0];
                                            rawCheckbox.checked ? selected++ : null;
                                        });
                                        $scope.$apply();
                                    }
                                });

                                $('tr').on('click', function () {
                                    let data: any = table.row(this).data();
                                    if (data) {
                                        if (!$("#select" + data.id).is(':focus')) {
                                            $state.go("kapua.child-accounts.detail", { id: data.id });
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

    getSelectedChildAccounts(): string[] {
        let selected: string[] = [];
        if (this.$scope.childAccounts)
            this.$scope.childAccounts.forEach((childAccounts: ChildAccount) => {
                let rawCheckbox: any = $('#select' + childAccounts.id)[0];
                if (rawCheckbox.checked == true)
                    selected.push(childAccounts.id);
            });
        return selected;
    }

    deleteChildAccounts() {
        let modal = this.$modal.open({
            template: require("../views/delete-child-accounts-modal.html"),
            controller: "DeleteChildAccountsModalCtrl as vm",
            resolve: {
                ids: () => this.getSelectedChildAccounts(),
                refreshChildAccountList: () => this.refreshChildAccountList
            }
        });
        modal.result.then((result: any) => {
            this.refreshChildAccountList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    addChildAccount() {
        let modal = this.$modal.open({
            template: require("../views/add-child-account-modal.html"),
            controller: "AddChildAccountModalCtrl as vm",
            resolve: {
                editChildAccountID: () => null,
                refreshChildAccountList: () => this.refreshChildAccountList
            }
        });
        modal.result.then((result: any) => {
            this.refreshChildAccountList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    editChildAccount(ChildAccountID) {
        let modal = this.$modal.open({
            template: require("../views/add-child-account-modal.html"),
            controller: "AddChildAccountModalCtrl as vm",
            resolve: {
                editChildAccountID: () => this.getSelectedChildAccounts()[0],
                refreshChildAccountList: () => this.refreshChildAccountList
            }
        });
        modal.result.then((result: any) => {
            this.refreshChildAccountList = result;
        },
            (result) => {
                console.warn(result);
            });
    }
}