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
export default class GrantPermissionModalCtrl {
    private permissions: Permission[];
    private domains: any[];
    private actions: any[];

    private submitModel = {
        domain: "all",
        permission: {
            action: "all"
        }
    }

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private userID: string,
        private refreshPermissionList: boolean,
        private usersService: IUsersService) {

        this.getDomains();

    }

     onChangeDomain() {
        if (this.submitModel.domain != "all") {
            this.domains.forEach((domain: any) => {
                if (domain.id === this.submitModel.domain) {
                    this.actions = domain.actions.action;
                }
            });
        }
    }

    // addPermission(userID: string, submitModel) {
    // this.usersService.addPermission(userID, submitModel).then((result: ng.IHttpPromiseCallbackArg<Permission>) => {
    //     console.log("Users Permission added", result.data);
    // });
    // }

    getDomains() {
        this.usersService.getDomains().then((result: ng.IHttpPromiseCallbackArg<ListResult<any>>) => {
            this.domains = result.data.items.item;
        });
    }

    ok() {
        // this.addPermission(this.userID, this.submitModel);
        this.$modalInstance.close(!this.refreshPermissionList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}