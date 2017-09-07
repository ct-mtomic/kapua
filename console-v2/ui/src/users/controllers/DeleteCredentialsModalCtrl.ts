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
export default class DeleteCredentialsModalCtrl {

  constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
    private usersService: IUsersService,
    private userID: string,
    private ids: string[],
    private refreshCredentialList: boolean) { }

delete() {
    this.ids.forEach((id: string) => {
    //   this.usersService.deleteCredentialByUserId(this.userID, id);
    });
    this.$modalInstance.close(!this.refreshCredentialList);
  }

  cancel() {
    this.$modalInstance.dismiss("cancel");
  }
}
