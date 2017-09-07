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
export default class AddAccessGroupModalCtrl {
    private accessGroup: AccessGroup;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editAccessGroupID: string,
        private refreshAccessGroupList: boolean,
        private accessGroupService: IAccessGroupsService) {

        this.editAccessGroupID ? this.getAccessGroupById(this.editAccessGroupID) : null;
    }
    private submitModel = {
        name: ""
    }

    getAccessGroupById(accessGroupID: string): void {
        this.accessGroupService.getAccessGroupById(accessGroupID).then((responseData: ng.IHttpPromiseCallbackArg<AccessGroup>) => {
            this.accessGroup = responseData.data;
            this.submitModel.name = responseData.data.name;
        });
    }

    addAccessGroup() {
        this.accessGroupService.addAccessGroup(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<AccessGroup>) => {
            console.log("Added access group: ", responseData.data);
        });
    }

    editAccessGroup(accessGroupID: string) {
        let updateModel = {
            name: this.submitModel.name
        }
        this.accessGroupService.updateAccessGroup(accessGroupID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<AccessGroup>) => {
            console.log("Updated access group: ", responseData.data);
        });
    }

    ok() {
        this.editAccessGroupID ? this.editAccessGroup(this.editAccessGroupID) : this.addAccessGroup();
        this.$modalInstance.close(!this.refreshAccessGroupList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
