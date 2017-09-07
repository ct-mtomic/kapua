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
export default class DeviceDetailEventsCtrl {
  private events: DeviceEvent[];

  constructor(private $stateParams: angular.ui.IStateParamsService,
    private $http: angular.IHttpService,
    private $scope: any,
    private devicesService: IDevicesService) {
    $scope.deviceId = $stateParams["id"];
    this.getEvents($scope.deviceId);
  }

  private config = {
    selectedItems: false,
    useExpandingRows: true,
    showSelectBox: false
  };

  getEvents(deviceID: string) {
    this.devicesService.getEventsByDeviceId(this.$scope.deviceId).then((responseData: ng.IHttpPromiseCallbackArg<ListResult<DeviceEvent>>) => {
      this.$scope.events = responseData.data.items.item;
      this.$scope.events.forEach((event: DeviceEvent) => {
        !event.eventMessage ? event.disableRowExpansion = true : event.disableRowExpansion = false;
      });
    });
  }
}