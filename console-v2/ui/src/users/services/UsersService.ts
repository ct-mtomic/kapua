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
export default class UsersService implements IUsersService {

    constructor(private $http: ng.IHttpService) {
    }

    getUsers(): ng.IHttpPromise<ListResult<User>> {
        return this.$http.get("/api/_/users");
    }

    getUserById(userID: string): ng.IHttpPromise<User> {
        return this.$http.get("/api/_/users/" + userID);
    }

    addUser(reqModel): ng.IHttpPromise<User> {
        return this.$http.post("/api/_/users", reqModel);
    }

    updateUser(userID: string, updateModel: any): ng.IHttpPromise<User> {
        return this.$http.put("/api/_/users/" + userID, updateModel);
    }

    deleteUserById(userID: string): void {
        this.$http.delete("/api/_/users/" + userID);
    }

    getRoles(): ng.IHttpPromise<ListResult<Role>> {
        return this.$http.get("/api/_/roles");
    }

    getPermissions(): ng.IHttpPromise<ListResult<Permission>> {
        return this.$http.get("/api/_/roles/AQ/permissions");
    }

    getDomains(): ng.IHttpPromise<ListResult<any>> {
        return this.$http.get("/api/_/domains");
    }
}