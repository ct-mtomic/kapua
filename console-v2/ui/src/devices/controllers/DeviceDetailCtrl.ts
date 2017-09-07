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
export default class DeviceDetailCtrl {
  private device: Device;
  private devicePackages: DevicePackages;
  private deviceEvents: DeviceEvents;
  private deviceBundles: DeviceBundles;
  private deviceConfigurations: DeviceConfigurations;
  private deviceCommands: DeviceCommands;
  private items: DeviceViewModel[];
  private packagesStatus = {
    "title": "Installed Packages",
    "count": null,
    "href": null,
    "iconClass": "fa fa-cube"
  };
  
  private eventsStatus = {
    "title": "Events",
    "count": null,
    "href": null,
    "iconClass": "fa fa-history"
  };

  private bundlesStatus = {
    "title": "Bundles",
    "count": null,
    "href": null,
    "iconClass": "fa fa-cubes"
  };

  private configurationsStatus = {
    "title": "Configurations",
    "count": null,
    "href": null,
    "iconClass": "fa fa-cogs"
  };

  private commandsStatus = {
    "title": "Commands",
    "count": null,
    "href": null,
    "iconClass": "fa fa-terminal"
  };

  private groupsStatus = {
    "title": "Groups",
    "count": null,
    "href": null,
    "iconClass": "fa fa-object-group"
  };

  private oneAtATime: boolean = false;

  constructor(private $stateParams: angular.ui.IStateParamsService,
    private $http: angular.IHttpService,
    private devicesService: IDevicesService,
    private deviceMapperService: IDeviceMapperService) {
    this.packagesStatus.href = `devices/${$stateParams["id"]}/packages`;
    this.eventsStatus.href = `devices/${$stateParams["id"]}/events`;
    this.bundlesStatus.href = `devices/${$stateParams["id"]}/bundles`;
    this.configurationsStatus.href = `devices/${$stateParams["id"]}/configurations`;
    this.commandsStatus.href = `devices/${$stateParams["id"]}/commands`;
    this.groupsStatus.href = `devices/${$stateParams["id"]}/groups`;
    this.getDeviceById($stateParams["id"]);
  }

  getDeviceById(deviceID): void {
    this.devicesService.getDeviceById(deviceID).then((responseData: ng.IHttpPromiseCallbackArg<Device>) => {
      this.device = responseData.data;
      this.items = this.deviceMapperService.prepareViewItems(this.device);
      if (this.device.connection && this.device.connection.status === "CONNECTED") {
        this.getBundlesCount(this.$stateParams["id"]);
        this.getPackagesCount(this.$stateParams["id"]);
        this.getEventsCount(this.$stateParams["id"]);
      }
    });
  }

  getEventsCount(deviceID: string) {
    this.devicesService.getEventsByDeviceId(deviceID).then((responseData: ng.IHttpPromiseCallbackArg<ListResult<DeviceEvent>>) => {
      this.eventsStatus.count = responseData.data.items.item.length;
    });
  }

  getBundlesCount(deviceID: string): void {
    this.devicesService.getBundlesByDeviceId(deviceID).then((responseData: ng.IHttpPromiseCallbackArg<DeviceBundles>) => {
      this.bundlesStatus.count = responseData.data.bundle.length;
    });
  }

  getPackagesCount(deviceID: string): void {
    this.devicesService.getPackagesByDeviceId(deviceID).then((responseData: ng.IHttpPromiseCallbackArg<DevicePackages>) => {
      this.packagesStatus.count = responseData.data.devicePackage.length;
    });
  }
}