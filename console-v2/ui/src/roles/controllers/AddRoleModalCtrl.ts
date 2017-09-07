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
    private role: Role;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editRoleID: string,
        private refreshRoleList: boolean,
        private rolesService: IRolesService) {

        this.editRoleID ? this.getRoleById(this.editRoleID) : null;
    }
    private submitModel = {
        permissions: [
            { "action": "read" }
        ],
        name: ""
    }

    getRoleById(roleID: string): void {
        this.rolesService.getRoleById(roleID).then((responseData: ng.IHttpPromiseCallbackArg<Role>) => {
            this.role = responseData.data;
            this.submitModel.name = responseData.data.name;
        });
    }

    addRole() {
        this.rolesService.addRole(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<Role>) => {
            console.log("Added role: ", responseData.data);
        });
    }

    editRole(roleID: string) {
        let updateModel = {
            name: this.submitModel.name
        }
        this.rolesService.updateRole(roleID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<Role>) => {
            console.log("Updated role: ", responseData.data);
        });
    }

    ok() {
        this.editRoleID ? this.editRole(this.editRoleID) : this.addRole();
        this.$modalInstance.close(!this.refreshRoleList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
