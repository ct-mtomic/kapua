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
export default class ChildAccountDetailCtrl {
    private childAccount: any;
    private usersStatus = {
        "title": "Users",
        "count": null,
        "href": null,
        "iconClass": "fa fa-users"
    };
    private settingsStatus = {
        "title": "Settings",
        "count": null,
        "href": null,
        "iconClass": "fa fa-cog"
    };

    private oneAtATime: boolean = false;

    constructor(private $stateParams: angular.ui.IStateParamsService,
        private childAccountsService: IChildAccountsService) {
        this.usersStatus.href = `child-accounts/${$stateParams["id"]}/users`;
        this.settingsStatus.href = `child-accounts/${$stateParams["id"]}/settings`;
        this.getAccountById($stateParams["id"]);
    }

    getAccountById(accountID): void {
        //   this.childAccountsService.getAccountById(accountID).then((responseData: ng.IHttpPromiseCallbackArg<ChildAccount>) => {
        // this.childAccount = responseData.data;        
        //   });

        this.childAccount = {
            id: "id1",
            name: "Acc Name 1",
            modifiedOn: "2017/09/11",
            modifiedBy: "admin",
            createdOn: "2017/09/11",
            createdBy: "admin",
            organizationName: "Org Name 1",
            email: "email@mail.com",
            referencePerson: "Person 1",
            phoneNumber: "+ 381 64 454 1032",
            address1: "Uzice 031",
            address2: "Cacak 032",
            postCode: "31000",
            city: "Uzice",
            state: "Srbija",
            country: "Srbija"
        }

    }
}