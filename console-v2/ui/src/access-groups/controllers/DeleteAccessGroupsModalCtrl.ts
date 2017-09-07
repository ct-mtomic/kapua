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
export default class DeleteAccessGroupsModalCtrl {

  constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
    private $http: angular.IHttpService,
    private accessGroupsService: IAccessGroupsService,
    private ids: string[],
    private refreshAccessGroupList: boolean) { }

delete() {
    this.ids.forEach((id: string) => {
      this.accessGroupsService.deleteAccessGroupById(id);
    });
    this.$modalInstance.close(!this.refreshAccessGroupList);
  }

  cancel() {
    this.$modalInstance.dismiss("cancel");
  }
}
