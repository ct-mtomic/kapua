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
export default class TagDetailCtrl {
    private tag = {
        id: "1",
        name: "Tag 1",
        createdBy: "ADMIN",
        createdOn: "08/23/2017",
        modifiedBy: "ADMIN",
        modifiedOn: "08/23/2017"
    }

    constructor(private $stateParams: angular.ui.IStateParamsService,
        private tagsService: ITagsService) {
        this.getTagById($stateParams["id"]);
    }

    getTagById(tagID: string): void {
        // this.tagsService.getTagById(tagID).then((responseData: ng.IHttpPromiseCallbackArg<Tag>) => {
        //     this.tag = responseData.data;
        // });
    }
}