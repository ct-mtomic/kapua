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

export default class TagsListCtrl {
    private tags: Tag[];
    private refreshTagList: boolean = false;

    constructor(private $scope: any,
        private $timeout: any,
        private $modal: angular.ui.bootstrap.IModalService,
        private $state: any,
        private tagsService: ITagsService) {

        $scope.$watch(
            () => { return this.refreshTagList; },
            () => {
                $timeout(function () {
                    // tagsService.getTags().then((result: ng.IHttpPromiseCallbackArg<ListResult<Tag>>) => {
                    $(() => {
                        // $scope.tags = result.data.items.item;
                        $scope.tags = [
                            {
                                id: "1",
                                name: "Tag 1",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                            {
                                id: "2",
                                name: "Tag 2",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                            {
                                id: "3",
                                name: "Tag 3",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                            {
                                id: "4",
                                name: "Tag 4",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                            {
                                id: "5",
                                name: "Tag 5",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                            {
                                id: "6",
                                name: "Tag 6",
                                createdBy: "ADMIN",
                                createdOn: "08/23/2017",
                                modifiedBy: "ADMIN",
                                modifiedOn: "08/23/2017"
                            },
                        ]
                        // DataTable Config
                        $("#table1").dataTable().fnDestroy();
                        $("#table1").dataTable({
                            columns: [
                                {
                                    data: null,
                                    className: "table-view-pf-select checkboxField",
                                    render: function (data, type, full, meta) {
                                        // Select row checkbox renderer
                                        let id = "select" + data.id;
                                        return `<label class="sr-only" for="` + id + `">Select row ` + meta.row +
                                            `</label><input type="checkbox" id="` + id + `" name="` + id + `">`;
                                    },
                                    sortable: false,
                                    width: "10px"
                                },
                                {
                                    data: "name",
                                    width: "35%",
                                },
                                {
                                    data: "createdBy",
                                    width: "25%",
                                },
                                {
                                    data: "createdOn"
                                }
                            ],
                            pageLength: 500,
                            data: $scope.tags,
                            dom: "t",
                            language: {
                                zeroRecords: "No records found"
                            },
                            order: [[1, "asc"]],
                            pfConfig: {
                                emptyStateSelector: "#emptyState1",
                                filterCols: [
                                    null,
                                    {
                                        default: true,
                                        optionSelector: "#filter1",
                                        placeholder: "Filter By Rendering Engine..."
                                    }, {
                                        optionSelector: "#filter2",
                                        placeholder: "Filter By Browser..."
                                    }, {
                                        optionSelector: "#filter3",
                                        placeholder: "Filter By Platform(s)..."
                                    }, {
                                        optionSelector: "#filter4",
                                        placeholder: "Filter By Engine Version..."
                                    }, {
                                        optionSelector: "#filter5",
                                        placeholder: "Filter By CSS Grade..."
                                    }
                                ],
                                toolbarSelector: "#toolbar1",
                                selectAllSelector: `th:first-child input[type="checkbox"]`
                            },
                            select: {
                                selector: `td:first-child input[type="checkbox"]`,
                                style: "multi"
                            },
                        } as DataTables.Settings);

                        /**
                         * Utility to find items in Table View
                         */
                        let findTableViewUtil = function (config) {
                            // Upon clicking the find button, show the find dropdown content
                            $(".btn-find").click(function () {
                                $(this).parent().find(".find-pf-dropdown-container").toggle();
                            });

                            // Upon clicking the find close button, hide the find dropdown content
                            $(".btn-find-close").click(function () {
                                $(".find-pf-dropdown-container").hide();
                            });

                            // Upon clicking on table row
                            let table = $('#table1').DataTable();

                            $(".checkBoxField").on('click', function () {
                                let data: any = table.row(this).data();
                                if (data) {
                                    if (!$('#select' + data.id).is(':focus')) {
                                        $('#select' + data.id).focus();
                                        $('#select' + data.id).click();
                                    }
                                    let selected: number = 0;
                                    $scope.tags.forEach((tag: Tag) => {
                                        let rawCheckbox: any = $('#select' + tag.id)[0];
                                        rawCheckbox.checked ? selected++ : null;
                                    });
                                    $scope.$apply();
                                    let allCheckbox: any = $('#selectAll')[0];
                                    selected === $scope.tags.length ? allCheckbox.checked = true : allCheckbox.checked = false;
                                } else {
                                    if (!$('#selectAll').is(':focus')) {
                                        $('#selectAll').focus();
                                        $('#selectAll').click();
                                    }
                                    $scope.tags.forEach((tag: Tag) => {
                                        let rawCheckbox: any = $('#select' + tag.id)[0];
                                        let allCheckbox: any = $('#selectAll')[0];
                                        rawCheckbox.checked = allCheckbox.checked;
                                    });

                                    let selected: number = 0;
                                    $scope.tags.forEach((tag: Tag) => {
                                        let rawCheckbox: any = $('#select' + tag.id)[0];
                                        rawCheckbox.checked ? selected++ : null;
                                    });
                                    $scope.$apply();
                                }
                            });

                            $('tr').on('click', function () {
                                let data: any = table.row(this).data();
                                if (data) {
                                    if (!$("#select" + data.id).is(':focus')) {
                                        $state.go("kapua.tags.detail", { id: data.id });
                                    }
                                }
                            });
                        };
                        // Initialize find util
                        new findTableViewUtil(null);
                        let dataTable = ($(".datatable") as any).dataTable();
                    });
                });
            }, 500);
        // });
    }

    getSelectedTags(): string[] {
        let selected: string[] = [];
        if (this.$scope.tags)
            this.$scope.tags.forEach((tag: Tag) => {
                let rawCheckbox: any = $('#select' + tag.id)[0];
                if (rawCheckbox.checked == true)
                    selected.push(tag.id);
            });
        return selected;
    }

    deleteTags() {
        let modal = this.$modal.open({
            template: require("../views/delete-tags-modal.html"),
            controller: "DeleteTagsModalCtrl as vm",
            resolve: {
                ids: () => this.getSelectedTags(),
                refreshTagList: () => this.refreshTagList
            }
        });
        modal.result.then((result: any) => {
            this.refreshTagList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    addTag() {
        let modal = this.$modal.open({
            template: require("../views/add-tag-modal.html"),
            controller: "AddTagModalCtrl as vm",
            resolve: {
                editTagID: () => null,
                refreshTagList: () => this.refreshTagList
            }
        });
        modal.result.then((result: any) => {
            this.refreshTagList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

    editTag(tagID) {
        let modal = this.$modal.open({
            template: require("../views/add-tag-modal.html"),
            controller: "AddTagModalCtrl as vm",
            resolve: {
                editTagID: () => this.getSelectedTags()[0],
                refreshTagList: () => this.refreshTagList
            }
        });
        modal.result.then((result: any) => {
            this.refreshTagList = result;
        },
            (result) => {
                console.warn(result);
            });
    }

}