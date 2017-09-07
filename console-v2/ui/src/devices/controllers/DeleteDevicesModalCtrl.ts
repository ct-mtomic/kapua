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
export default class DeleteDevicesModalCtrl {

  constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
    private $http: angular.IHttpService,
    private devicesService: IDevicesService,
    private ids: string[],
    private refreshDeviceList: boolean) { }

  delete() {
    this.ids.forEach((id: string) => {
      this.devicesService.deleteDevice(id);
    });
    this.$modalInstance.close(!this.refreshDeviceList);
  }

  cancel() {
    this.$modalInstance.dismiss("cancel");
  }
}
