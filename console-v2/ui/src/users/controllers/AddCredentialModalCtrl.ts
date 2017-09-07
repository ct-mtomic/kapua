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
export default class AddCredentialModalCtrl {
    private credential: any;
    private password: string;
    private confirmPassword: string;
    private validPassword: boolean = true;

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editUserID: string,
        private editCredentialID: string,
        private refreshCredentialList: boolean,
        private usersService: IUsersService) {

        this.usersService.getUserById(this.editUserID).then((responseData: ng.IHttpPromiseCallbackArg<User>) => {
            this.submitModel.user = responseData.data.name;
        });

        // this.editCredentialID ? this.getCredentialById(this.editUserID, this.editCredentialID) : null;
    }

    private dpOptions = {
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true
    };

    private submitModel = {
        user: "",
        type: "",
        status: "ENABLED"
    };

    onChangeConfirmPassword() {
        if (this.password === this.confirmPassword)
            this.validPassword = true;
        else
            this.validPassword = false;
    }

    // getCredentialById(userID: string, credentialID: string): void {
    //     this.usersService.getUserById(userID, credentialID).then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
    //         this.credential = responseData.data;
    //         this.submitModel.user = responseData.data.user;
    //         this.submitModel.type = responseData.data.type;
    //         this.submitModel.status = responseData.data.status;
    //     });
    // }

    addCredential() {
        // this.usersService.adCredential(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
        //     console.log("Added credential: ", responseData.data);
        // });
    }

    editCredential(userID: string, credentialID: string) {
        let updateModel = {
            // externalId: userID,
            user: this.submitModel.user,
            type: this.submitModel.type,
            status: this.submitModel.status
        }
        // this.usersService.updateCredential(userID, credentialID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<any>) => {
        //     console.log("Updated credential: ", responseData.data);
        // });
    }

    ok() {
        this.editCredentialID ? this.editCredential(this.editUserID, this.editCredentialID) : this.addCredential();
        this.$modalInstance.close(!this.refreshCredentialList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
