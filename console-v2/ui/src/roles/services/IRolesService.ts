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
interface IRolesService {
    getRoles(): ng.IHttpPromise<ListResult<Role>>;
    getPermissionsByRole(roleID: string): ng.IHttpPromise<ListResult<RolePermission>>;
    addPermission(roleID: string, reqModel): ng.IHttpPromise<RolePermission>;
    getRoleById(roleID: string): ng.IHttpPromise<Role>;
    getRoleCount(): any;
    addRole(reqModel): ng.IHttpPromise<Role>;
    updateRole(roleID: string, updateModel: any): ng.IHttpPromise<Role>;
    deleteRoleById(roleID: string): void;
    deleteRolePermissionById(roleID: string, rolePermissionID: string): void;
    getDomains(): ng.IHttpPromise<ListResult<Domain>>;
    getUsers(): ng.IHttpPromise<any>;
}