/*******************************************************************************
* Copyright (c) 2011, 2016 Eurotech and/or its affiliates
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
import { DeviceConnectionStatus } from "../models/DeviceConnectionStatus";

export default class DevicesListCtrl {
  private devices: Device[];
  private refreshDeviceList: boolean = false;

  constructor(private $scope: any,
    private $timeout: any,
    private $filter: any,
    private $modal: angular.ui.bootstrap.IModalService,
    private $state: any,
    private devicesService: IDevicesService) {

    $scope.allItems = [];
    $scope.items = [];
    $scope.actionsText = "";

    $scope.$watch(
      () => { return $scope.refreshDeviceList; },
      () => {
        $scope.updateItems();
      });

    $scope.columns = [
      {
        header: "Connection Status",
        itemField: "connectionStatus",
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
        header: "Display Name",
        itemField: "displayName"
      },
      {
        header: "Operating System Version",
        itemField: "osVersion"
      },
      {
        header: "Serial Number",
        itemField: "serialNumber"
      }
    ];

    $scope.pageConfig = {
      pageNumber: 1,
      pageSize: 5,
      pageSizeIncrements: [5, 10, 15]
    }

    var matchesFilter = function (item, filter) {
      var match = true;

      if (filter.id === 'connectionStatus') {
        match = item.connectionStatus === filter.value;
      } else if (filter.id === 'clientId') {
        match = item.clientId.match(filter.value) !== null;
      } else if (filter.id === 'displayName') {
        match = item.displayName.match(filter.value);
      } else if (filter.id === 'osVersion') {
        match = item.osVersion.match(filter.value) !== null;
      } else if (filter.id === 'serialNumber') {
        match = item.serialNumber.match(filter.value);
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

    var deleteDevices = function (action) {
      let selected: string[] = [];
      var selectedItems = $filter('filter')($scope.allItems, { selected: true });
      if (selectedItems.length) {
        selectedItems.forEach((item: Device) => {
          selected.push(item.id);
        });
        let modal = $modal.open({
          template: require("../views/delete-devices-modal.html"),
          controller: "DeleteDevicesModalCtrl as vm",
          resolve: {
            ids: () => selected,
            refreshDeviceList: () => $scope.refreshDeviceList
          }
        });
        modal.result.then((result: any) => {
          $scope.refreshDeviceList = result;
          $scope.toolbarActionsConfig.primaryActions[1].isDisabled = true;
        },
          (result) => {
            console.warn(result);
          });
      }
    };

    var deleteDevice = function (action, item) {
      let selected: string[] = [];
      selected.push(item.id);
      let modal = $modal.open({
        template: require("../views/delete-devices-modal.html"),
        controller: "DeleteDevicesModalCtrl as vm",
        resolve: {
          ids: () => selected,
          refreshDeviceList: () => $scope.refreshDeviceList
        }
      });
      modal.result.then((result: any) => {
        $scope.refreshDeviceList = result;
        $scope.toolbarActionsConfig.primaryActions[1].isDisabled = true;
      },
        (result) => {
          console.warn(result);
        });
    };

    var addDevice = function (action) {
      let modal = $modal.open({
        template: require("../views/add-device-modal.html"),
        controller: "AddDeviceModalCtrl as vm",
        resolve: {
          editDeviceID: () => undefined,
          refreshDeviceList: () => $scope.refreshDeviceList
        }
      });
      modal.result.then((result: any) => {
        $scope.refreshDeviceList = result;
      },
        (result) => {
          console.warn(result);
        });
    }

    var editDevice = function (action, item) {
      let modal = $modal.open({
        template: require("../views/add-device-modal.html"),
        controller: "AddDeviceModalCtrl as vm",
        resolve: {
          editDeviceID: () => item.id,
          refreshDeviceList: () => $scope.refreshDeviceList
        }
      });
      modal.result.then((result: any) => {
        $scope.refreshDeviceList = result;
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
      $state.go("kapua.devices.detail", { id: item.id });
    }

    $scope.filterConfig = {
      fields: [
        {
          id: 'connectionStatus',
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
          id: 'displayName',
          title: 'Display Name',
          placeholder: 'Filter by Display Name...',
          filterType: 'text'
        },
        {
          id: 'osVersion',
          title: 'Operating System Version',
          placeholder: 'Filter by OS Version...',
          filterType: 'text'
        },
        {
          id: 'serialNumber',
          title: 'Serial Number',
          placeholder: 'Filter by Serial Number...',
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
          name: 'Add device',
          title: 'Add new device',
          actionFn: addDevice
        },
        {
          name: 'Delete devices',
          title: 'Delete selected devices',
          actionFn: deleteDevices,
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
      selectionMatchProp: "displayName",
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
        title: 'View device details',
        actionFn: viewDetails
      }
    ];

    $scope.tableMenuActions = [
      {
        name: 'Edit',
        title: 'Edit device',
        actionFn: editDevice
      },
      {
        name: 'Delete',
        title: 'Delete device',
        actionFn: deleteDevice
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
        devicesService.getDevices().then((result: ng.IHttpPromiseCallbackArg<ListResult<Device>>) => {
          $scope.allItems = result.data.items.item;
          $scope.allItems.forEach((item: Device) => {
              item.connectionStatus = item.connection && item.connection.status ? item.connection.status : "DISCONNECTED";
          });
          $scope.items = $scope.allItems;
          $scope.tableConfig.itemsAvailable = $scope.allItems.length ? true : false;
          $scope.updateItemsAvailable();
        });
        $scope.showComponent = true
      }, 500);
    };
  }
}