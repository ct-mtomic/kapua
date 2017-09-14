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
export default class ChildAccountsService implements IChildAccountsService {

    constructor(private $http: ng.IHttpService) {
    }

    getChildAccounts(): ng.IHttpPromise<ListResult<ChildAccount>> {
        return this.$http.get("/api/_/accounts");
    }

    getAccountById(accountID): ng.IHttpPromise<ChildAccount> {
        return this.$http.get("/api/_/accounts/" + accountID);
    }

    addAccount(reqModel): ng.IHttpPromise<ChildAccount> {
        return this.$http.post("/api/_/accounts", reqModel);
    }

    updateAccount(accountID: string, updateModel: any): ng.IHttpPromise<ChildAccount> {
        return this.$http.put("/api/_/accounts/" + accountID, updateModel);
    }

    deleteAccountById(accountID: string): void {
        this.$http.delete("/api/_/accounts/" + accountID);
    }

    getUsers(): ng.IHttpPromise<ListResult<User>> {
        return this.$http.get("/api/_/users");
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
    
    getUserById(userID: string): ng.IHttpPromise<User> {
        return this.$http.get("/api/_/users/" + userID);
    }

}