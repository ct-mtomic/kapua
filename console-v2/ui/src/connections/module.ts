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
import ConnectionsListCtrl from "./controllers/ConnectionsListCtrl";
import ConnectionDetailCtrl from "./controllers/ConnectionDetailCtrl";

import ConnectionsService from "./services/ConnectionsService";

import "./assets/styles/connections.scss";

angular.module("app.connections", [])
    .config(["$stateProvider",
        ($stateProvider: any,
            $authProvider) => {
            $stateProvider.state("kapua.connections", {
                breadcrumb: "Connections",
                url: "/connections",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/connections-list.html"),
                        controller: "ConnectionsListCtrl as vm"
                    }
                }
            })
            .state("kapua.connections.detail", {
                    breadcrumb: "Connection Details",
                    url: "/:id",
                    views: {
                        "kapuaView@kapua": {
                            template: require("./views/connections-details.html"),
                            controller: "ConnectionDetailCtrl as vm"
                        }
                    }
                });
        }])
    //services
    .service("connectionsService", ["$http", ConnectionsService])

    // controllers
    .controller("ConnectionsListCtrl", ["$scope", "$timeout", "$uibModal", "$state", "connectionsService", ConnectionsListCtrl])
    .controller("ConnectionDetailCtrl", ["$stateParams", "connectionsService", ConnectionDetailCtrl]);