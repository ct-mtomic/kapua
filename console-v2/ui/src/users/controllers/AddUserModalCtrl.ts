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
export default class AddUserModalCtrl {
    private user: User;
    private password: string;
    private confirmPassword: string;
    private validPassword: boolean;
    private phonePattern: string = "^[0-9\+]{1,}[0-9\- ]{3,15}$";

    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editUserID: string,
        private refreshUserList: boolean,
        private usersService: IUsersService) {

        this.editUserID ? this.getUserById(this.editUserID) : null;
    }

    private dpOptions = {
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true
    };

    private submitModel = {
        name: "",
        displayName: "",
        email: "",
        phoneNumber: "",
        status: "ENABLED"
    };

    onChangeConfirmPassword() {
        if (this.password === this.confirmPassword)
            this.validPassword = true;
        else
            this.validPassword = false;
    }

    getUserById(userID: string): void {
        this.usersService.getUserById(userID).then((responseData: ng.IHttpPromiseCallbackArg<User>) => {
            this.user = responseData.data;
            this.submitModel.name = responseData.data.name;
            this.submitModel.displayName = responseData.data.displayName;
            this.submitModel.email = responseData.data.email;
            this.submitModel.phoneNumber = responseData.data.phoneNumber;
            this.submitModel.status = responseData.data.status;
        });
    }

    addUser() {
        this.usersService.addUser(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<User>) => {
            console.log("Added user: ", responseData.data);
        });
    }

    editUser(userID: string) {
        let updateModel = {
            // externalId: userID,
            name: this.submitModel.name,
            displayName: this.submitModel.displayName,
            email: this.submitModel.email,
            phoneNumber: this.submitModel.phoneNumber,
            status: this.submitModel.status
        }
        this.usersService.updateUser(userID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<User>) => {
            console.log("Updated user: ", responseData.data);
        });
    }

    ok() {
        this.editUserID ? this.editUser(this.editUserID) : this.addUser();
        this.$modalInstance.close(!this.refreshUserList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
