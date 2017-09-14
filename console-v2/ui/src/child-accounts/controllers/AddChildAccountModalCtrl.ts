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
export default class AddChildAccountModalCtrl {
    private childAccount: ChildAccount;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editChildAccountID: string,
        private refreshChildAccountList: boolean,
        private childAccountsService: IChildAccountsService) {

        this.editChildAccountID ? this.getChildAccountById(this.editChildAccountID) : null;
    }
    private submitModel = {
        permissions: [
            { "action": "read" }
        ],
        name: ""
    }

    getChildAccountById(childAccountID: string): void {
        this.childAccountsService.getAccountById(childAccountID).then((responseData: ng.IHttpPromiseCallbackArg<ChildAccount>) => {
            this.childAccount = responseData.data;
            this.submitModel.name = responseData.data.name;
        });
    }

    addChildAccount() {
        this.childAccountsService.addAccount(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<ChildAccount>) => {
            console.log("Added ChildAccount: ", responseData.data);
        });
    }

    editChildAccount(ChildAccountID: string) {
        let updateModel = {
            name: this.submitModel.name
        }
        this.childAccountsService.updateAccount(ChildAccountID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<ChildAccount>) => {
            console.log("Updated ChildAccount: ", responseData.data);
        });
    }

    ok() {
        this.editChildAccountID ? this.editChildAccount(this.editChildAccountID) : this.addChildAccount();
        this.$modalInstance.close(!this.refreshChildAccountList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
