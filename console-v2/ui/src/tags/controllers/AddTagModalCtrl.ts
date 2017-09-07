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
export default class AddtagModalCtrl {
    private tag: Tag;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private editTagID: string,
        private refreshTagList: boolean,
        private tagsService: ITagsService) {

        this.editTagID ? this.getTagById(this.editTagID) : null;
    }
    private submitModel = {
        name: ""
    }

    getTagById(tagID: string): void {
        // this.tagsService.getTagById(tagID).then((responseData: ng.IHttpPromiseCallbackArg<Tag>) => {
        //     this.tag = responseData.data;
        //     this.submitModel.name = responseData.data.name;
        // });
        this.submitModel.name = "Name 1";
    }

    addTag() {
        // this.tagsService.addTag(this.submitModel).then((responseData: ng.IHttpPromiseCallbackArg<Tag>) => {
        //     console.log("Added tag: ", responseData.data);
        // });
    }

    editTag(tagID: string) {
        let updateModel = {
            name: this.submitModel.name
        }
        // this.tagsService.updateTag(tagID, updateModel).then((responseData: ng.IHttpPromiseCallbackArg<Tag>) => {
        //     console.log("Updated tag: ", responseData.data);
        // });
    }

    ok() {
        this.editTagID ? this.editTag(this.editTagID) : this.addTag();
        this.$modalInstance.close(!this.refreshTagList);
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
