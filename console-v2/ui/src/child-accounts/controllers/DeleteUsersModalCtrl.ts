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
export default class DeleteUsersModalCtrl {
    
      constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private $http: angular.IHttpService,
        private childAccountsService: IChildAccountsService,
        private childAccountID: string,
        private ids: string[],
        private refreshUserList: boolean) { }
    
    delete() {
        this.ids.forEach((id: string) => {
        //   this.childAccountsService.deleteUserById(id);
        });
        this.$modalInstance.close(!this.refreshUserList);
      }
    
      cancel() {
        this.$modalInstance.dismiss("cancel");
      }
    }
    