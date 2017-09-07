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

export default class SettingsCtrl {
    private params = [
        {displayName: "Param 1", value: "1"},
        {displayName: "Param 2", value: "2"},
        {displayName: "Param 3", value: "3"},
        {displayName: "Param 4", value: "4"},
        {displayName: "Param 5", value: "5"}
    ];

    private items = [
        {name: "Setting 1", data: this.params},
        {name: "Setting 2", data: this.params},
        {name: "Setting 3", data: this.params},
        {name: "Setting 4", data: this.params},
        {name: "Setting 5", data: this.params}
    ];

    
    constructor(private settingsService: ISettingsService) {
        
    }
}