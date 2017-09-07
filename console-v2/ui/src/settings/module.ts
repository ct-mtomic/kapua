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
import SettingsCtrl from "./controllers/SettingsCtrl";

import SettingsService from "./services/SettingsService";

import "./assets/styles/settings.scss";

angular.module("app.settings", [])
    .config(["$stateProvider",
        ($stateProvider: angular.ui.IStateProvider,
            $authProvider) => {
            $stateProvider.state("kapua.settings", {
                url: "/settings",
                views: {
                    "kapuaView@kapua": {
                        template: require("./views/settings.html"),
                        controller: "SettingsCtrl as vm"
                    }
                }
            })
               
        }])
    //services
    .service("settingsService",["$http", SettingsService])

    //controllers
    .controller("SettingsCtrl", ["settingsService", SettingsCtrl]);