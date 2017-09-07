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
export default class RoleDetailGrantedUsersCtrl {
  private roleId: string;

  private config = {
    selectedItems: false,
    useExpandingRows: false,
    showSelectBox: false
  };

  constructor(private $scope: any,
    private $stateParams: angular.ui.IStateParamsService,
    private rolesService: IRolesService) {
    $scope.roleId = $stateParams["id"];

    this.getUsers();
  }

  getUsers() {
    this.rolesService.getUsers().then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
      this.$scope.users = responseData.data.items.item;
    });
  }

}