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
export default class RoleDetailCtrl {
    private role: Role;
    private roleDescription: RoleDescription[];
    private RolePermissions: RolePermission[];
    private roleSubjects: RoleSubject[];
    private permissionsStatus = {
        "title": "Permissions",
        "count": null,
        "href": null,
        "iconClass": "fa fa-key",
        "notifications": []
    };
    private subjectsStatus = {
        "title": "Granted Users",
        "count": null,
        "href": null,
        "iconClass": "fa fa-pencil-square-o",
        "notifications": []
    };

    constructor(private $stateParams: angular.ui.IStateParamsService,
        private rolesService: IRolesService) {
        this.permissionsStatus.href = `roles/${$stateParams["id"]}/permissions`;
        this.subjectsStatus.href = `roles/${$stateParams["id"]}/grantedusers`;
        this.getRoleById($stateParams["id"]);
    }

    getRoleById(roleID: string): void {
        this.rolesService.getRoleById(roleID).then((responseData: ng.IHttpPromiseCallbackArg<Role>) => {
            this.role = responseData.data;
        });

        this.rolesService.getPermissionsByRole(roleID).then((responseData: ng.IHttpPromiseCallbackArg<ListResult<RolePermission>>) => {
            this.permissionsStatus.count = responseData.data.items.item.length;
        });
    }
}