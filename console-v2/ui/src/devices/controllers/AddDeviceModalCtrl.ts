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
export default class AddDeviceModalCtrl {
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private $http: angular.IHttpService,
        private refreshDeviceList: boolean,
        private devicesService: IDevicesService) {
        this.getGroups();
    }

    private regex: string = "^[a-zA-Z0-9-_:]*$";
    private cliendIdMinLength: number = 3;
    private groups: Group[];
    private submitModel: any = {
        clientId: "",
        groupId: "",
        displayName: "",
        osVersion: "Windows 10 2.3.3",
        serialNumber: "My-Raspberry-Pi"
    }

    getGroups(): any {
        this.devicesService.getGroups().then((responseData: ng.IHttpPromiseCallbackArg<ListResult<Group>>) => {
            this.groups = responseData.data.items.item;
        });
    }

    addDevice() {
        this.devicesService.addDevice(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<Device>) => {
            console.log("Added device: ", responseData.data);
        });
    }

    ok() {
        this.addDevice();
        this.$modalInstance.close(!this.refreshDeviceList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
