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
export default class AddRolePermissionModalCtrl {

    private domains: Domain[];
    private selectedDomain: Domain;
    private actions: string[];
    private selectedGroup: string = "all";
    
    private submitModel = {
        domain: "all",
        permission: {
            action: "all"
        }
    }

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private roleID: string,
        private refreshPermissionList: boolean,
        private rolesService: IRolesService) {

        this.getDomains();
    }

    getDomains() {
        this.rolesService.getDomains().then((results: ng.IHttpPromiseCallbackArg<ListResult<Domain>>) => {
            this.domains = results.data.items.item;
        });
    }

    onChangeDomain() {
        if (this.submitModel.domain != "all") {
            this.domains.forEach((domain: Domain) => {
                if (domain.id === this.submitModel.domain) {
                    this.actions = domain.actions.action;
                }
            });
        }
    }

    addPermission(roleID: string, submitModel) {
        this.rolesService.addPermission(roleID, submitModel).then((result: ng.IHttpPromiseCallbackArg<RolePermission>) => {
            console.log("Permission added", result.data);
        });
    }

    ok() {
        this.addPermission(this.roleID, this.submitModel);
        this.$modalInstance.close(!this.refreshPermissionList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
