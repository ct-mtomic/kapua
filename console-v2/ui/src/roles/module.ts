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
import RoleListCtrl from "./controllers/RolesListCtrl";
import RoleDetailCtrl from "./controllers/RoleDetailCtrl";
import RoleDetailPermissionsCtrl from "./controllers/RoleDetailPermissionsCtrl";
import RoleDetailGrantedUsersCtrl from "./controllers/RoleDetailGrantedUsersCtrl";
import AddRoleModalCtrl from "./controllers/AddRoleModalCtrl";
import AddRolePermissionModalCtrl from "./controllers/AddRolePermissionModalCtrl";
import DeleteRolesModalCtrl from "./controllers/DeleteRolesModalCtrl";
import DeleteRolePermissionModalCtrl from "./controllers/DeleteRolePermissionModalCtrl";

import RolesService from "./services/RolesService"

import "./assets/styles/roles.scss";

angular.module("app.roles", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.roles", {
                breadcrumb: "Roles",
                url: "/roles",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/roles-list.html"),
                        controller: "RolesListCtrl as vm"
                    }
                }
            })
                .state("kapua.roles.detail", {
                    breadcrumb: "Role Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/roles-details.html"),
                            controller: "RoleDetailCtrl as vm"
                        }
                    }
                })
                .state("kapua.roles.detail.permissions", {
                    breadcrumb: "Permissions",
                    url: "/permissions",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/role-details/permissions.html"),
                            controller: "RoleDetailPermissionsCtrl as vm"
                        }
                    }
                })
                .state("kapua.roles.detail.grantedusers", {
                    breadcrumb: "Granted Users",
                    url: "/grantedusers",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/role-details/granted-users.html"),
                            controller: "RoleDetailGrantedUsersCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("rolesService", ["$http", RolesService])

    //controllers
    .controller("RolesListCtrl", ["$scope", "$timeout", "$uibModal", "$state", "rolesService", RoleListCtrl])
    .controller("AddRoleModalCtrl", ["$modalInstance", "editRoleID", "refreshRoleList", "rolesService", AddRoleModalCtrl])
    .controller("AddRolePermissionModalCtrl", ["$modalInstance", "roleID", "refreshPermissionList", "rolesService", AddRolePermissionModalCtrl])
    .controller("DeleteRolesModalCtrl", ["$modalInstance", "$http", "rolesService", "ids", "refreshRoleList", DeleteRolesModalCtrl])
    .controller("DeleteRolePermissionModalCtrl", ["$modalInstance", "$http", "rolesService", "roleID", "ids", "refreshPermissionList", DeleteRolePermissionModalCtrl])
    .controller("RoleDetailCtrl", ["$stateParams", "rolesService", RoleDetailCtrl])
    .controller("RoleDetailPermissionsCtrl", ["$stateParams", "$scope", "$timeout", "$uibModal", "$state", "rolesService", RoleDetailPermissionsCtrl])
    .controller("RoleDetailGrantedUsersCtrl", ["$scope", "$stateParams", "rolesService", RoleDetailGrantedUsersCtrl]);


