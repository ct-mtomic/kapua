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
interface IChildAccountsService {
    getChildAccounts(): ng.IHttpPromise<ListResult<ChildAccount>>;
    getAccountById(accountID): ng.IHttpPromise<ChildAccount>;
    addAccount(reqModel): ng.IHttpPromise<ChildAccount>;
    updateAccount(accountID: string, updateModel: any): ng.IHttpPromise<ChildAccount>;
    deleteAccountById(accountID: string): void;
    getUsers(): ng.IHttpPromise<ListResult<User>>;
    addUser(reqModel): ng.IHttpPromise<User>;
    updateUser(userID: string, updateModel: any): ng.IHttpPromise<User>;
    deleteUserById(userID: string): void;
    getUserById(userID: string): ng.IHttpPromise<User>;
}