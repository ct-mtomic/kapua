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
export default class AccessGroupsService implements IAccessGroupsService {

    constructor(private $http: ng.IHttpService) {

    }

    getAccessGroups(): ng.IHttpPromise<ListResult<AccessGroup>> {
        return this.$http.get("/api/_/groups");
    }

    getAccessGroupById(accessGroupID: string): ng.IHttpPromise<AccessGroup> {
        return this.$http.get("/api/_/groups/" + accessGroupID);
    }

    addAccessGroup(reqModel): ng.IHttpPromise<AccessGroup> {
        return this.$http.post("/api/_/groups", reqModel);
    }

    updateAccessGroup(accessGroupID: string, updateModel: any): ng.IHttpPromise<AccessGroup> {
        return this.$http.put("/api/_/groups/" + accessGroupID, updateModel);
    }

    deleteAccessGroupById(accessGroupID: string): void {
        this.$http.delete("/api/_/groups/" + accessGroupID);
    }
}