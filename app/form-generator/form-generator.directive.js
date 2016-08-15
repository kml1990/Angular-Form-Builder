(function () {
    'use strict';

    angular
        .module('formBuilder')
        .directive('ngFormGenerator', ngFormGenerator);

    ngFormGenerator.$inject = ['$timeout', '$compile', '$http'];
    function ngFormGenerator($timeout, $compile, $http) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            template: '<div ng-include="getTemplate()" class="formB"></div>',
            bindToController: true,
            controller: FormGeneratorController,
            controllerAs: 'vm',
            link: link,
            replace: true,
            transclue: true,
            restrict: 'E',
            scope: {
                form: '=',
                edit: '='
            }
        };
        return directive;

        function link(scope, element, attrs) {
            scope.getTemplate = function () {
                var form = "form-default";
                if (scope.vm.form.form_isMultistep === true) {
                    form = "form-multistep";
                }

                return 'app/form-generator/' + form + '.html';
            }

            scope.$on('rebuildForm', function () {
                scope.rebuildForm();
            });

            //Rebuild form
            scope.rebuildForm = function () {
                $timeout(function () {
                    var form = $('.dynamic-form-wizard')
                    if (form[0]) {
                        var form = $('.dynamic-form-wizard');
                        form.remove();
                        $http.get(scope.getTemplate()).then(function (response) {
                            var template = angular.element(response.data);
                            $('.formB').append(template);
                            $compile(template)(scope);
                        });
                    }
                    scope.generateForm();
                }, 500)
            }

            scope.$watch('vm.form.form_isMultistep', function (newVal) {
                scope.rebuildForm();
            }, true);

            //Generate form
            scope.generateForm = function () {
                $timeout(function () {
                    $('.dynamic-form-wizard').bootstrapWizard({
                        'nextSelector': '.dynamic-button-next', 'previousSelector': '.dynamic-button-previous',
                        onTabShow: function (tab, navigation, index) {
                            var $total = navigation.find('li').length;
                            var $current = index + 1;
                            var $percent = ($current / $total) * 100;
                            $('.dynamic-form-wizard').find('.dynamic-progress-bar').css({ width: $percent + '%' });

                            if ($current >= $total) {
                                $('.dynamic-form-wizard').find('.dynamic-form-actions a.dynamic-button-next').hide();
                                $('.dynamic-form-wizard').find('.dynamic-form-actions .dynamic-button-submit').show();
                                $('.dynamic-form-wizard').find('.dynamic-form-actions .dynamic-button-submit').removeClass('disabled');
                            } else {
                                $('.dynamic-form-wizard').find('.dynamic-form-actions a.dynamic-button-next').show();
                                $('.dynamic-form-wizard').find('.dynamic-form-actions .dynamic-button-submit').hide();
                            }
                        }
                    });

                    $('.dynamic-form-wizard .finish').click(function () {
                        alert('Finished!, Starting over!');
                        $('.dynamic-form-wizard').find("a[href*='tab1']").trigger('click');
                    });
                }, 1000);
            }

            scope.sortableOptions = {
                update: function (e, ui) {
                    console.log(e);
                    console.log(ui)
                },
                stop: function (e, ui) {
                    console.log(e);
                    console.log(ui)
                }
            };
        }
    }
    /* @ngInject */
    function FormGeneratorController($scope, $uibModal) {
        var vm = this;

        vm.addRow = function () {
            var length = vm.form.form_rows.length;
            var row = {
                "row_id": length + 1,
                "columns": []
            }
            vm.form.form_rows.push(row);
        }

        vm.removeRow = function (index) {
            if (index > 0) {
                vm.form.form_rows.splice(index, 1);
            } else {
                //show message
            }
        }

        vm.addColumn = function (index) {
            var length = vm.form.form_rows[index].columns.length;
            var column = {
                "column_id": length + 1,
                "column_width": 'col-md-12'
            }
            vm.form.form_rows[index].columns.push(column);
        }

        //remove column
        vm.removeColumn = function (rowId, index) {
            var rowIndex = _.findIndex(vm.form.form_rows, { row_id: rowId })
            vm.form.form_rows[rowIndex].columns.splice(index, 1)
        }

        //Increase column size
        vm.increaseColumn = function (rowId, index) {
            //get column
            var rowIndex = _.findIndex(vm.form.form_rows, { row_id: rowId })
            var column_width = vm.form.form_rows[rowIndex].columns[index].column_width;
            var number = 0;
            var width = 'col-md-12'
            if (column_width !== 'col-md-12') {
                number = parseInt(column_width.match(/\d+/g)) + 1;
                vm.form.form_rows[rowIndex].columns[index].column_width = 'col-md-' + number;
            } else {
                number = column_width.match(/\d+/g);
            }
        }

        //Decrease column size
        vm.decreaseColumn = function (rowId, index) {
            //get column
            var rowIndex = _.findIndex(vm.form.form_rows, { row_id: rowId })
            var column_width = vm.form.form_rows[rowIndex].columns[index].column_width;
            var number = 0;
            var width = 'col-md-12'
            if (column_width !== 'col-md-1') {
                number = parseInt(column_width.match(/\d+/g)) - 1;
                vm.form.form_rows[rowIndex].columns[index].column_width = 'col-md-' + number;
            } else {
                number = column_width.match(/\d+/g);
            }
        }
        //Add field for normal form
        vm.addField = function (field, rowId, columnIndex) {
            // console.log(rowId)
            // console.log(columnIndex)
            var newField = {};
            var newId = 1;

            //Get row
            var rowIndex = _.findIndex(vm.form.form_rows, { row_id: rowId })

            if (vm.form.form_rows[rowIndex].columns[columnIndex].form_fields) {
                newId = vm.form.form_rows[rowIndex].columns[columnIndex].form_fields.length + 1;
            } else {
                vm.form.form_rows[rowIndex].columns[columnIndex].form_fields = [];
                newId = 1;
            }

            if (field === "radio") {
                newField = {
                    "field_id": newId,
                    "field_title": "Label",
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_styling": {
                        "field_position": "default",
                    },
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else if (field === "dropdown") {
                newField = {
                    "field_id": newId,
                    "field_title": "Label",
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else if (field === "checkbox") {
                newField = {
                    "field_id": newId,
                    "field_title": "Label",
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_styling": {
                        "field_position": "default",
                    },
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else {
                newField = {
                    "field_id": newId,
                    "field_title": "Label",
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false
                }
            }

            vm.form.form_rows[rowIndex].columns[columnIndex].form_fields.push(newField)
        }

        //Remove field for normal form
        $scope.$on('removeField', function (event, data) {
            var rowIndex = _.findIndex(vm.form.form_rows, { row_id: parseInt(data.row_id) })
            var columnIndex = _.findIndex(vm.form.form_rows[rowIndex].columns, { column_id: parseInt(data.column_id) })
            var fieldIndex = _.findIndex(vm.form.form_rows[rowIndex].columns[columnIndex].form_fields, { field_id: parseInt(data.field_id) })
            vm.form.form_rows[rowIndex].columns[columnIndex].form_fields.splice(fieldIndex, 1)
        });

        //Add form for multistep form
        vm.addFieldMultistep = function (field, stepId) {
            console.log(stepId)
            var newField = {};
            var newId = 1;
            if (vm.form.form_steps[stepId - 1].step_fields) {
                newId = vm.form.form_steps[stepId - 1].step_fields.length + 1;
            } else {
                vm.form.form_steps[stepId - 1].step_fields = [];
                newId = 1;
            }
            if (field === "radio") {
                newField = {
                    "field_id": newId,
                    "field_title": null,
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_styling": {
                        "field_position": "default",
                    },
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else if (field === "dropdown") {
                newField = {
                    "field_id": newId,
                    "field_title": null,
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else if (field === "checkbox") {
                newField = {
                    "field_id": newId,
                    "field_title": null,
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false,
                    "field_styling": {
                        "field_position": "default",
                    },
                    "field_options": [
                        {
                            "option_id": 1,
                            "option_title": "Option 1",
                            "option_value": "Value1"
                        },
                        {
                            "option_id": 2,
                            "option_title": "Option 2",
                            "option_value": "Value2"
                        }
                    ]
                }
            } else {
                newField = {
                    "field_id": newId,
                    "field_title": null,
                    "field_type": field,
                    "field_value": null,
                    "field_required": false,
                    "field_disabled": false
                }
            }
            var step = vm.form.form_steps[stepId - 1];
            step.step_fields.push(newField)
        }

        vm.editForm = function (form) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/common/modals/multistepForm/multistepForm.html',
                controller: 'MultistepFromController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    form: function () {
                        return form;
                    }
                }
            });
        }
    }
})();