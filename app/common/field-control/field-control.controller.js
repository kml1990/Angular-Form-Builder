(function () {
    'use strict';

    angular
        .module('formBuilder')
        .controller('FieldControlController', FieldControlController);

    FieldControlController.$inject = ['$rootScope', '$scope', '$uibModal', '$uibModalInstance', '$timeout', 'field'];
    function FieldControlController($rootScope, $scope, $uibModal, $uibModalInstance, $timeout, field) {
        var vm = this;

        activate();

        ////////////////

        function activate() {
            vm.field = field;
            vm.requestType = false;

            //Check if field has options
            if (vm.field.field_type === 'dropdown') {
                vm.hasOptions = true;
            } else if (vm.field.field_type === 'radio') {
                vm.hasOptions = true;
            } else if (vm.field.field_type === 'checkbox') {
                vm.hasOptions = true;
            } else {
                vm.hasOptions = false;
            }

            //Add option
            vm.addOption = function (field) {
                if (!field.field_options)
                    vm.field.field_options = new Array();

                var lastOptionID = 0;

                if (field.field_options[field.field_options.length - 1])
                    lastOptionID = field.field_options[field.field_options.length - 1].option_id;

                // new option's id
                var option_id = lastOptionID + 1;

                var newOption = {
                    "option_id": option_id,
                    "option_title": "Option " + option_id,
                    "option_value": "Value" + option_id
                };

                // put new option into field_options array
                vm.field.field_options.push(newOption);
            }

            //Delete option
            vm.deleteOption = function (field, option) {
                for (var i = 0; i < field.field_options.length; i++) {
                    if (field.field_options[i].option_id == option.option_id) {
                        vm.field.field_options.splice(i, 1);
                        break;
                    }
                }
            }

            vm.viewIcons = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'app/common/icon-select/icon-select.html',
                    controller: 'IconListController',
                    controllerAs: 'vm',
                    size: 'lg',
                });
            }

            $scope.$on('select-icon', function (event, args) {
                vm.field.field_styling.field_icon = args;
            });

            vm.cancel = function () {
                $uibModalInstance.dismiss();
            }
        }
    }
})();