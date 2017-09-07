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
export default class DeleteRolesModalCtrl {

  constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
    private $http: angular.IHttpService,
    private rolesService: IRolesService,
    private ids: string[],
    private refreshRoleList: boolean) { }

delete() {
    this.ids.forEach((id: string) => {
      this.rolesService.deleteRoleById(id);
    });
    this.$modalInstance.close(!this.refreshRoleList);
  }

  cancel() {
    this.$modalInstance.dismiss("cancel");
  }
}
