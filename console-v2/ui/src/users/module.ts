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
import UsersListCtrl from "./controllers/UsersListCtrl";
import AddUserModalCtrl from "./controllers/AddUserModalCtrl";
import DeleteUsersModalCtrl from "./controllers/DeleteUsersModalCtrl";
import UserDetailCtrl from "./controllers/UserDetailCtrl";
import UserPermissionsCtrl from "./controllers/UserPermissionsCtrl";
import UserRolesCtrl from "./controllers/UserRolesCtrl";
import UserCredentialsCtrl from "./controllers/UserCredentialsCtrl";
import AddRoleModalCtrl from "./controllers/AddRoleModalCtrl";
import DeleteRolesModalCtrl from "./controllers/DeleteRolesModalCtrl";
import GrantPermissionModalCtrl from "./controllers/GrantPermissionModalCtrl";
import RevokePermissionsModalCtrl from "./controllers/RevokePermissionsModalCtrl";
import AddCredentialModalCtrl from "./controllers/AddCredentialModalCtrl";
import DeleteCredentialsModalCtrl from "./controllers/DeleteCredentialsModalCtrl";

import UsersService from "./services/UsersService";

import "./assets/styles/users.scss";

angular.module("app.users", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.users", {
                breadcrumb: "Users",
                url: "/users",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/users-list.html"),
                        controller: "UsersListCtrl as vm"
                    }
                }
            })
            .state("kapua.users.detail", {
                    breadcrumb: "User Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/user-details.html"),
                            controller: "UserDetailCtrl as vm"
                        }
                    }
                })
                .state("kapua.users.detail.permissions", {
                    breadcrumb: "Permissions",
                    url: "/permissions",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/user-details/permissions.html"),
                            controller: "UserPermissionsCtrl as vm"
                        }
                    }
                })
                .state("kapua.users.detail.roles", {
                    breadcrumb: "Roles",
                    url: "/roles",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/user-details/roles.html"),
                            controller: "UserRolesCtrl as vm"
                        }
                    }
                })
                .state("kapua.users.detail.credentials", {
                    breadcrumb: "Credentials",
                    url: "/credentials",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/user-details/credentials.html"),
                            controller: "UserCredentialsCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("usersService", ["$http", UsersService])

    // controllers
    .controller("UsersListCtrl", ["$scope", "$timeout", "$uibModal", "$state", "usersService", UsersListCtrl])
    .controller("AddUserModalCtrl", ["$uibModalInstance", "editUserID", "refreshUserList", "usersService", AddUserModalCtrl])
    .controller("DeleteUsersModalCtrl", ["$uibModalInstance", "$http", "usersService", "ids", "refreshUserList", DeleteUsersModalCtrl])
    .controller("UserDetailCtrl", ["$stateParams", "usersService", UserDetailCtrl])
    .controller("UserPermissionsCtrl", ["$stateParams", "$scope", "$timeout", "$uibModal", "$state", "usersService", UserPermissionsCtrl])
    .controller("UserRolesCtrl", ["$stateParams", "$scope", "$timeout", "$uibModal", "$state", "usersService", UserRolesCtrl]) 
    .controller("UserCredentialsCtrl", ["$stateParams", "$scope", "$timeout", "$uibModal", "$state", "usersService", UserCredentialsCtrl])
    .controller("AddRoleModalCtrl", ["$uibModalInstance", "userID", "refreshRoleList", "usersService", AddRoleModalCtrl])
    .controller("DeleteRolesModalCtrl", ["$uibModalInstance", "usersService", "userID", "ids",  "refreshRoleList", DeleteRolesModalCtrl])
    .controller("GrantPermissionModalCtrl", ["$uibModalInstance", "userID", "refreshPermissionsList", "usersService", GrantPermissionModalCtrl])
    .controller("RevokePermissionsModalCtrl", ["$uibModalInstance", "usersService", "userID", "ids",  "refreshPermissionsList", RevokePermissionsModalCtrl])
    .controller("AddCredentialModalCtrl", ["$uibModalInstance", "editUserID", "editCredentialID", "refreshCredentialList",  "usersService", AddCredentialModalCtrl])
    .controller("DeleteCredentialsModalCtrl", ["$uibModalInstance", "usersService", "userID", "ids",  "refreshCredentialList", DeleteCredentialsModalCtrl]);