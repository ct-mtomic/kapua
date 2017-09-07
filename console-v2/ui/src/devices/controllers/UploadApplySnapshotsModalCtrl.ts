/*******************************************************************************
* Copyright (c) 2011, 2016 Eurotech and/or its affiliates                       
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
export default class UploadApplySnapshotsModalCtrl {
    private editorForm: any;
    constructor(private $modalInstance: angular.ui.bootstrap.IModalServiceInstance,
        private $scope: any,
        private $http: angular.IHttpService,
        private devicesService: IDevicesService) {

        $scope.fileUpload = function (element) {
            $scope.file = element.files[0];
            $scope.filePath = element.value;
            $scope.$apply();
        }
        // File input validation
        $scope.$watch(
            () => { return $scope.filePath; },
            () => {
                if ($scope.filePath != undefined)
                    this.editorForm.$dirty = true;
            }
        );
    }
    ok() {
        this.$modalInstance.close("ok");
    }
    cancel() {
        this.$modalInstance.dismiss("cancel");
    }
}
