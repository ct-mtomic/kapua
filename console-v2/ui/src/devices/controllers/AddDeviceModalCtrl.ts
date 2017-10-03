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
    private device: Device;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private $http: angular.IHttpService,
        private editDeviceID: string,
        private refreshDeviceList: boolean,
        private devicesService: IDevicesService) {
        this.editDeviceID ? this.getDeviceById(this.editDeviceID) : null;
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

    getDeviceById(deviceID): void {
        this.devicesService.getDeviceById(deviceID).then((responseData: ng.IHttpPromiseCallbackArg<Device>) => {
            this.device = responseData.data;
            this.submitModel.clientId = responseData.data.clientId;
            this.submitModel.displayName = responseData.data.displayName;
        });
    }

    editDevice(deviceID: string) {
        let updateModel = {
            clientId: this.submitModel.cliendId,
            displayName: this.submitModel.displayName,
            groupId: this.submitModel.groupId,
            osVersion: "Windows 10 2.3.3",
            serialNumber: "My-Raspberry-Pi"
        }
        this.devicesService.updateDevice(deviceID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<Device>) => {
            console.log("Updated device: ", responseData.data);
        });
    }

    ok() {
        this.editDeviceID ? this.editDevice(this.editDeviceID) : this.addDevice();
        this.$modalInstance.close(!this.refreshDeviceList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
