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
export default class RolesService implements IRolesService {

    constructor(private $http: ng.IHttpService) {
    }
    
    getRoles(): ng.IHttpPromise<ListResult<Role>> {
        return this.$http.get("/api/_/roles");
    }

    getRoleById(roleID: string): ng.IHttpPromise<Role> {
        return this.$http.get("/api/_/roles/" + roleID);
    }

    getRoleCount(): any {
        return this.$http.get("/api/_/roles/_count");
    }

    getPermissionsByRole(roleID: string): ng.IHttpPromise<ListResult<RolePermission>> {
        return this.$http.get("/api/_/roles/" + roleID + "/permissions");
    }

    addPermission(roleID: string, reqModel): ng.IHttpPromise<RolePermission> {
        return this.$http.post("/api/_/roles/" + roleID + "/permissions", reqModel);
    }

    addRole(reqModel): ng.IHttpPromise<Role> {
        return this.$http.post("/api/_/roles", reqModel);
    }

    updateRole(roleID: string, updateModel: any): ng.IHttpPromise<Role> {
        return this.$http.put("/api/_/roles/" + roleID, updateModel);
    }

    deleteRoleById(roleID: string): void {
        this.$http.delete("/api/_/roles/" + roleID);
    }

    deleteRolePermissionById(roleID: string, rolePermissionID: string): void {
        this.$http.delete("/api/_/roles/" + roleID + "/permissions/" + rolePermissionID);
    }

    getDomains(): ng.IHttpPromise<ListResult<Domain>> {
        return this.$http.get("/api/_/domains");
    }

    getUsers(): ng.IHttpPromise<any> {
        return this.$http.get("/api/_/users");
    }
}