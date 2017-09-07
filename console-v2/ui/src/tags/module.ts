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
import TagsListCtrl from "./controllers/TagsListCtrl";
import TagDetailsCtrl from "./controllers/TagDetailsCtrl";
import AddTagModalCtrl from "./controllers/AddTagModalCtrl";
import DeleteTagsModalCtrl from "./controllers/DeleteTagsModalCtrl";

import TagsService from "./services/tagsService";

import "./assets/styles/tags.scss";

angular.module("app.tags", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.tags", {
                breadcrumb: "Tags",
                url: "/tags",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/tags-list.html"),
                        controller: "TagsListCtrl as vm"
                    }
                }
            })
                .state("kapua.tags.detail", {
                    breadcrumb: "Tags Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/tags-details.html"),
                            controller: "TagDetailsCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("tagsService", ["$http", TagsService])

    //controllers
    .controller("TagsListCtrl", ["$scope", "$timeout", "$modal", "$state", "tagsService", TagsListCtrl])
    .controller("TagDetailsCtrl", ["$stateParams", "tagsService", TagDetailsCtrl])
    .controller("AddTagModalCtrl", ["$modalInstance", "editTagID", "refreshTagList", "tagsService", AddTagModalCtrl])
    .controller("DeleteTagsModalCtrl", ["$modalInstance", "$http", "tagsService", "ids", "refreshTagList", DeleteTagsModalCtrl]);

