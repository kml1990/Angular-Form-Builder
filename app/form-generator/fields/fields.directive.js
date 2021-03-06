(function () {
    'use strict';

    angular
        .module('formBuilder')
        .directive('ngField', ngField);

    ngField.$inject = ['$http', '$compile'];
    function ngField($http, $compile) {
        // Usage:
        //
        // Creates:
        //
        var getTemplateUrl = function (field) {
            var type = field.field_type;
            var templateUrl = 'app/form-generator/fields/field-templates/';
            var supported_fields = [
                'textfield',
                'email',
                'textarea',
                'checkbox',
                'date',
                'dropdown',
                'hidden',
                'password',
                'radio'
            ]


            var index = _.findIndex(supported_fields, function(o) { return o == type; });
            if (index !== -1) {
                return templateUrl += type + '.html';
            }
        }

        var directive = {
            template: '<div ng-bind="field"></div>',
            bindToController: true,
            controller: FieldController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
                field: '=',
                edit: '=',
                formLayout: '=',
                row: '@',
                column: '@'
            }
        };
        return directive;

        function link(scope, element, attrs) {
            // GET template content from path
            var templateUrl = getTemplateUrl(scope.vm.field);
            $http.get(templateUrl).success(function (data) {
                element.html(data);
                $compile(element.contents())(scope);
            });
        }
    }
    /* @ngInject */
    function FieldController($rootScope, $scope, $uibModal) {
        var vm = this;

        vm.editField = function (field) {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/common/field-control/field-control.html',
                controller: 'FieldControlController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    field: function () {
                        return field;
                    }
                }
            });
        }

        vm.removeField = function (field) {
            var field = { "row_id": vm.row, "column_id": vm.column, "field_id": field.field_id }

            $rootScope.$broadcast('removeField', field);
        }
    }
})();