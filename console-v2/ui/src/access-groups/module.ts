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
import AccessGroupsListCtrl from "./controllers/AccessGroupsListCtrl";
import AddAccessGroupModalCtrl from "./controllers/AddAccessGroupModalCtrl";
import DeleteAccessGroupsModalCtrl from "./controllers/DeleteAccessGroupsModalCtrl";
import AccessGroupDetailsCtrl from "./controllers/AccessGroupDetailsCtrl";

import AccessGroupsService from "./services/AccessGroupsService";

import "./assets/styles/access-groups.scss";

angular.module("app.access-groups", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.access-groups", {
                breadcrumb: "Access Groups",
                url: "/access-groups",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/access-groups-list.html"),
                        controller: "AccessGroupsListCtrl as vm"
                    }
                }
            })
                .state("kapua.access-groups.detail", {
                    breadcrumb: "Access Group Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/access-group-details.html"),
                            controller: "AccessGroupDetailsCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("accessGroupsService", ["$http", AccessGroupsService])

    //controllers
    .controller("AccessGroupsListCtrl", ["$scope", "$timeout", "$uibModal", "$state", "accessGroupsService", AccessGroupsListCtrl])
    .controller("AddAccessGroupModalCtrl", ["$modalInstance", "editAccessGroupID", "refreshAccessGroupList", "accessGroupsService", AddAccessGroupModalCtrl])
    .controller("DeleteAccessGroupsModalCtrl", ["$modalInstance", "$http", "accessGroupsService", "ids", "refreshAccessGroupList", DeleteAccessGroupsModalCtrl])
    .controller("AccessGroupDetailsCtrl", ["$stateParams", "accessGroupsService", AccessGroupDetailsCtrl]);


