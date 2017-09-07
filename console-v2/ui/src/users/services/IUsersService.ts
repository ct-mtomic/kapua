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
interface IUsersService {
    getUsers(): ng.IHttpPromise<ListResult<User>>;
    getUserById(userID: string): ng.IHttpPromise<User>;
    addUser(reqModel): ng.IHttpPromise<User>;
    updateUser(userID: string, updateModel: any): ng.IHttpPromise<User>;
    deleteUserById(userID: string): void;
    getRoles(): ng.IHttpPromise<ListResult<Role>>;
    getPermissions(): ng.IHttpPromise<ListResult<Permission>>;
    getDomains(): ng.IHttpPromise<ListResult<any>>;
}