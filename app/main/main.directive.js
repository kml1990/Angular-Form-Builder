(function () {
    'use strict';

    angular
        .module('formBuilder')
        .directive('main', main);

    main.$inject = [];
    function main() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            templateUrl: 'app/main/main.directive.html',
            replace: true,
            bindToController: true,
            controller: MainController,
            controllerAs: 'vm',
            link: link,
            restrict: 'E',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {

            /* WIZARD SETUP */
            $('.form-builder').bootstrapWizard({
                'nextSelector': '.button-next', 'previousSelector': '.button-previous',
                onTabShow: function (tab, navigation, index) {
                    var $total = navigation.find('li').length;
                    var $current = index + 1;
                    var $percent = ($current / $total) * 100;
                    //$('.form-builder').find('.progress-bar').css({ width: $percent + '%' });

                    if ($current >= $total) {
                        $('.form-builder').find('.form-nav a.button-next').hide();
                        $('.form-builder').find('.form-nav a.button-submit').show();
                        $('.form-builder').find('.form-nav a.button-submit').removeClass('disabled');
                    } else {
                        $('.form-builder').find('.form-nav a.button-next').show();
                        $('.form-builder').find('.form-nav a.button-submit').hide();
                    }
                }
            });

            $('.form-builder .finish').click(function () {
                alert('Finished!, Starting over!');
                $('.form-builder').find("a[href*='tab1']").trigger('click');
            });
        }
    }
    /* @ngInject */
    function MainController($scope, $uibModal) {

        var vm = this;

        vm.edit = true;

        vm.form = {
            "form_id": "1",
            "form_layout": "default",
            "form_isMultistep": false,
            "form_rows": [
                {
                    "row_id": 1,
                    "columns": [
                        {
                            "column_id": 1,
                            "column_width": "col-md-12",
                            "form_fields": [
                                {
                                    "field_id": 1,
                                    "field_title": "Label",
                                    "field_type": "dropdown",
                                    "field_value": null,
                                    "field_required": false,
                                    "field_disabled": false,
                                    "field_data_source": "manually",
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
                            ]
                        }
                    ]
                }
            ]
        }

        vm.selectColor = function () {
            $uibModal.open({
                animation: true,
                templateUrl: 'app/common/color-select/color-select.html',
                controller: 'ColorSelectController',
                controllerAs: 'vm',
                size: 'lg',
            });
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

        $scope.$on('select-form-name-color', function (event, args) {
            vm.form.form_name_color = args;
        });



    }
})();