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

export default class UserCredentialsCtrl {
  private credentials: any[];
  private refreshList: boolean = false;

  constructor(private $stateParams: angular.ui.IStateParamsService,
    private $scope: any,
    private $timeout: any,
    private $filter: any,
    private $modal: angular.ui.bootstrap.IModalService,
    private $state: any,
    private usersService: IUsersService) {

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
        itemField: "enableStatus",
        templateFn: function (value) {
          var style = value === "ENABLED" ? '29,158,116' : '255,0,0';
          return '<i class="fa fa-key" style="color: rgb(' + style + '); padding-top: 4px;"</i>';
        }
      },
      {
        header: "Id",
        itemField: "id"
      },
      {
        header: "Credential Type",
        itemField: "credentialType"
      },
      {
        header: "Expiration Date",
        itemField: "expirationDate"
      },
      {
        header: "Created On",
        itemField: "createdOn"
      },
      {
        header: "Created By",
        itemField: "createdBy"
      }
    ];

    $scope.pageConfig = {
      pageNumber: 1,
      pageSize: 5,
      pageSizeIncrements: [5, 10, 15]
    }

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'enableStatus') {
        match = item.enableStatus === filter.value;
      } else if (filter.id === 'credentialType') {
        match = item.credentialType.match(filter.value) !== null;
      } else if (filter.id === 'expirationDate') {
        match = item.expirationDate.match(filter.value);
      } else if (filter.id === 'createdOn') {
        match = item.createdOn.match(filter.value) !== null;
      } else if (filter.id === 'createdBy') {
        match = item.createdBy.match(filter.value);
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
        selectedItems.forEach((item: any) => {
          selected.push(item.id);
        });
        let modal = $modal.open({
          template: require("../views/user-details/delete-credentials-modal.html"),
          controller: "DeleteUserCredentialsModalCtrl as vm",
          resolve: {
            userID: () => $stateParams["id"],
            ids: () => selected,
            refreshCredentialList: () => $scope.refreshList
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
        template: require("../views/user-details/delete-credentials-modal.html"),
        controller: "DeleteUserCredentialsModalCtrl as vm",
        resolve: {
          userID: () => $stateParams["id"],
          ids: () => selected,
          refreshCredentialList: () => $scope.refreshList
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
        template: require("../views/user-details/add-credential-modal.html"),
        controller: "AddUserCredentialModalCtrl as vm",
        resolve: {
          editUserID: () => $stateParams["id"],
          editCredentialID: () => undefined,
          refreshCredentialList: () => $scope.refreshList
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
        template: require("../views/user-details/add-credential-modal.html"),
        controller: "AddUserCredentialModalCtrl as vm",
        resolve: {
          editUserID: () => $stateParams["id"],
          editCredentialID: () => item.id,
          refreshCredentialList: () => $scope.refreshList
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
          id: 'enableStatus',
          title: 'Status',
          placeholder: 'Filter by Status...',
          filterType: 'select',
          filterValues: ['ENABLED', 'DISABLED']
        },
        {
          id: 'credentialType',
          title: 'Credential Type',
          placeholder: 'Filter by Credential Type...',
          filterType: 'text'
        },
        {
          id: 'expirationDate',
          title: 'Expiration Date',
          placeholder: 'Filter by Expiration Date...',
          filterType: 'text'
        },
        {
          id: 'createdOn',
          title: 'Created On',
          placeholder: 'Filter by Created On...',
          filterType: 'text'
        },
        {
          id: 'createdBy',
          title: 'Created By',
          placeholder: 'Filter by Created By...',
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
          name: 'Add Credential',
          title: 'Add new Credential',
          actionFn: addItem
        },
        {
          name: 'Delete Credential',
          title: 'Delete selected Credential',
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
      selectionMatchProp: "id",
      itemsAvailable: true,
      showCheckboxes: true
    };

    $scope.emptyStateConfig = {
      icon: 'pficon-warning-triangle-o',
      title: 'No Items Available'
    };

    $scope.tableActionButtons = [
      {
        name: 'Edit',
        title: 'Edit Credential',
        actionFn: editItem
      },
    ];

    $scope.tableMenuActions = [
      {
        name: 'Delete',
        title: 'Delete Credential',
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
        // usersService.getCredentials().then((result: ng.IHttpPromiseCallbackArg<ListResult<Credential>>) => {
        //   $scope.allItems = result.data.items.item;
        $scope.allItems = [
          { id: "id1", enableStatus: "ENABLED", credentialType: "Type", expirationDate: "2017-10-08", createdOn: "2017-08-08", createdBy: "AQ" },
          { id: "id2", enableStatus: "DISABLED", credentialType: "Type", expirationDate: "2017-10-08", createdOn: "2017-08-08", createdBy: "AQ" },
          { id: "id3", enableStatus: "ENABLED", credentialType: "Type", expirationDate: "2017-10-08", createdOn: "2017-08-08", createdBy: "AQ" },
          { id: "id4", enableStatus: "DISABLED", credentialType: "Type", expirationDate: "2017-10-08", createdOn: "2017-08-08", createdBy: "AQ" },
          { id: "id5", enableStatus: "ENABLED", credentialType: "Type", expirationDate: "2017-10-08", createdOn: "2017-08-08", createdBy: "AQ" },
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