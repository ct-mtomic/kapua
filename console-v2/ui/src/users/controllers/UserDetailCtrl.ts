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
export default class UserDetailCtrl {
    private user: User;

    private rolesStatus = {
        "title": "Roles",
        "count": null,
        "href": null,
        "iconClass": "fa fa-user-plus",
        "notifications": []
    };

    private permissionsStatus = {
        "title": "Permissions",
        "count": null,
        "href": null,
        "iconClass": "fa fa-check-circle",
        "notifications": []
    };

    private credentialsStatus = {
        "title": "Credentials",
        "count": null,
        "href": null,
        "iconClass": "fa fa-key",
        "notifications": []
    };

    constructor(private $stateParams: angular.ui.IStateParamsService,
        private usersService: IUsersService) {
        this.rolesStatus.href = `users/${$stateParams["id"]}/roles`;
        this.permissionsStatus.href = `users/${$stateParams["id"]}/permissions`;
        this.credentialsStatus.href = `users/${$stateParams["id"]}/credentials`;
        this.getUserById($stateParams["id"]);
    }

    getUserById(userID: string): void {
        this.usersService.getUserById(userID).then((responseData: ng.IHttpPromiseCallbackArg<User>) => {
            this.user = responseData.data;
        });
    }
}