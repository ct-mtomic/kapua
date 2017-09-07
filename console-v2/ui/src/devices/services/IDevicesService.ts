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
interface IDevicesService {
    getDevices(): ng.IHttpPromise<ListResult<Device>>;
    addDevice(reqModel): ng.IHttpPromise<Device>;
    deleteDevice(deviceID: string): void;
    getDeviceById(deviceID: string): ng.IHttpPromise<Device>;
    getBundlesByDeviceId(deviceID: string): ng.IHttpPromise<DeviceBundles>;
    getEventsByDeviceId(deviceID: string): ng.IHttpPromise<ListResult<DeviceEvent>>;
    getPackagesByDeviceId(deviceID: string): ng.IHttpPromise<DevicePackages>;
    getConfigsByDeviceId(deviceID: string): ng.IHttpPromise<DeviceConfigurations>;
    startDeviceBundle(deviceID: string, bundleID: number): void;
    stopDeviceBundle(deviceID: string, bundleID: number): void;
    downloadPackage(deviceID: string, devicePackage: DevicePackage): any;
    uninstallPackage(deviceID: string, devicePackage: DevicePackage): any;
    executeCommand(deviceID: string): any;    
    applyConfig(config: DeviceConfiguration, deviceID: string): ng.IHttpPromise<DeviceConfigurations>;
    getSnapshotsByDeviceId(deviceID: string): ng.IHttpPromise<DeviceSnapshots>;
    rollbackSnapshot(deviceID: string, snapshotID: string): void;
    getGroups(): ng.IHttpPromise<ListResult<Group>>;
}