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
export default class UserRolesCtrl {
  private roles: Role[];
  private refreshRoleList: boolean = false;

  constructor(private $stateParams: angular.ui.IStateParamsService,
    private $scope: any,
    private $timeout: any,
    private $modal: angular.ui.bootstrap.IModalService,
    private $state: any,
   private usersService: IUsersService) {

    $scope.$watch(
      () => { return this.refreshRoleList; },
      () => {
        $timeout(function () {
          usersService.getRoles().then((result: ng.IHttpPromiseCallbackArg<ListResult<Role>>) => {
            $(() => {
              $scope.roles = result.data.items.item;
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
                    width: "35%",
                  },
                  {
                    data: "createdBy",
                    width: "25%",
                  },
                  {
                    data: "createdOn"
                  }
                ],
                data: $scope.roles,
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
                    $scope.roles.forEach((role: Role) => {
                      let rawCheckbox: any = $('#select' + role.id)[0];
                      rawCheckbox.checked ? selected++ : null;
                    });
                    $scope.$apply();
                    let allCheckbox: any = $('#selectAll')[0];
                    selected === $scope.roles.length ? allCheckbox.checked = true : allCheckbox.checked = false;
                  } else {
                    if (!$('#selectAll').is(':focus')) {
                      $('#selectAll').focus();
                      $('#selectAll').click();
                    }
                    $scope.roles.forEach((role: Role) => {
                      let rawCheckbox: any = $('#select' + role.id)[0];
                      let allCheckbox: any = $('#selectAll')[0];
                      rawCheckbox.checked = allCheckbox.checked;
                    });

                    let selected: number = 0;
                    $scope.roles.forEach((role: Role) => {
                      let rawCheckbox: any = $('#select' + role.id)[0];
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

  getSelectedRoles(): string[] {
    let selected: string[] = [];
    if (this.$scope.roles)
      this.$scope.roles.forEach((role: Role) => {
        let rawCheckbox: any = $('#select' + role.id)[0];
        if (rawCheckbox.checked == true)
          selected.push(role.id);
      });
    return selected;
  }

  deleteRoles() {
    let modal = this.$modal.open({
      template: require("../views/user-details/delete-roles-modal.html"),
      controller: "DeleteRolesModalCtrl as vm",
      resolve: {
        userID: () => this.$stateParams["id"],
        ids: () => this.getSelectedRoles(),
        refreshRoleList: () => this.refreshRoleList
      }
    });
    modal.result.then((result: any) => {
      this.refreshRoleList = result;
    },
      (result) => {
        console.warn(result);
      });
  }

  addRole() {
    let modal = this.$modal.open({
      template: require("../views/user-details/add-role-modal.html"),
      controller: "AddRoleModalCtrl as vm",
      resolve: {
        userID: () => this.$stateParams["id"],
        refreshRoleList: () => this.refreshRoleList
      }
    });
    modal.result.then((result: any) => {
      this.refreshRoleList = result;
    },
      (result) => {
        console.warn(result);
      });
  }
}