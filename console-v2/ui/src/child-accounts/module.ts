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
import ChildAccountsListCtrl from "./controllers/ChildAccountsListCtrl";
import ChildAccountDetailCtrl from "./controllers/ChildAccountDetailCtrl";
import ChildAccountsUsersCtrl from "./controllers/ChildAccountsUsersCtrl";
import ChildAccountsSettingsCtrl from "./controllers/ChildAccountsSettingsCtrl";
import AddUserModalCtrl from "./controllers/AddUserModalCtrl";
import DeleteUsersModalCtrl from "./controllers/DeleteUsersModalCtrl";
import AddChildAccountModalCtrl from "./controllers/AddChildAccountModalCtrl";
import DeleteChildAccountsModalCtrl from "./controllers/DeleteChildAccountsModalCtrl";

import ChildAccountsService from "./services/ChildAccountsService"

import "./assets/styles/child-accounts.scss";

angular.module("app.child-accounts", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.child-accounts", {
                breadcrumb: "Child Accounts",
                url: "/child-accounts",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/child-accounts-list.html"),
                        controller: "ChildAccountsListCtrl as vm"
                    }
                }
            })
                .state("kapua.child-accounts.detail", {
                    breadcrumb: "Child Account Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/child-accounts-details.html"),
                            controller: "ChildAccountDetailCtrl as vm"
                        }
                    }
                })
                .state("kapua.child-accounts.detail.users", {
                    breadcrumb: "Users",
                    url: "/users",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/child-accounts-details/users.html"),
                            controller: "ChildAccountsUsersCtrl as vm"
                        }
                    }
                })
                .state("kapua.child-accounts.detail.settings", {
                    breadcrumb: "Settings",
                    url: "/settings",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/child-accounts-details/settings.html"),
                            controller: "ChildAccountsSettingsCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("childAccountsService", ["$http", ChildAccountsService])

    //controllers
    .controller("ChildAccountsListCtrl", ["$scope", "$timeout", "$uibModal", "$state", "childAccountsService", ChildAccountsListCtrl])
    .controller("AddChildAccountModalCtrl", ["$modalInstance", "editChildAccountID", "refreshChildAccountList", "childAccountsService", AddChildAccountModalCtrl])
    .controller("ChildAccountsUsersCtrl", ["$scope", "$timeout", "$uibModal", "$state", "$stateParams", "childAccountsService", ChildAccountsUsersCtrl])
    .controller("ChildAccountsSettingsCtrl", ["$scope", "$uibModal", "$stateParams", "childAccountsService", ChildAccountsSettingsCtrl])
    .controller("DeleteChildAccountsModalCtrl", ["$modalInstance", "$http", "childAccountsService", "ids", "refreshChildAccountList", DeleteChildAccountsModalCtrl])
    .controller("AddUserModalCtrl", ["$modalInstance", "childAccountID", "editUserID", "refreshUserList", "childAccountsService", AddUserModalCtrl])
    .controller("DeleteUsersModalCtrl", ["$modalInstance", "$http", "childAccountsService", "childAccountID", "ids", "refreshUserList", DeleteUsersModalCtrl])
    .controller("ChildAccountDetailCtrl", ["$stateParams", "childAccountsService", ChildAccountDetailCtrl]);