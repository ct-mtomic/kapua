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
export default class AddRoleModalCtrl {
    private roles: Role[];

    private submitModel = {
        role: null
    }

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private userID: string,
        private refreshRoleList: boolean,
        private usersService: IUsersService) {

        this.getRoles();

    }

    addRole(userID: string, submitModel) {
        // this.usersService.addRole(userID, submitModel).then((result: ng.IHttpPromiseCallbackArg<Role>) => {
        //     console.log("Users Role added", result.data);
        // });
    }

    getRoles() {
        this.usersService.getRoles().then((result: ng.IHttpPromiseCallbackArg<ListResult<Role>>) => {
            this.roles = result.data.items.item;
        });
    }

    ok() {
        this.addRole(this.userID, this.submitModel);
        this.$modalInstance.close(!this.refreshRoleList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}