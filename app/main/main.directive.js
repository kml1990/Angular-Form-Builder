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
    function MainController() {

        var vm = this;

        vm.fontColors = [
            { 'name': 'Turquoise', 'value': 'turquoise' },
            { 'name': 'Green Sea', 'value': 'green-sea' },
            { 'name': 'Emerald', 'value': 'emerald' },
            { 'name': 'Nephritis', 'value': 'nephritis' },
            { 'name': 'Peter river', 'value': 'peter-river' },
            { 'name': 'Belize hole', 'value': 'belize hole' },
            { 'name': 'Amethyst', 'value': 'amethyst' },
            { 'name': 'Wisteria', 'value': 'wisteria' },
            { 'name': 'Wet asphalt', 'value': 'wet-asphalt' },
            { 'name': 'Midnight blue', 'value': 'midnight-blue' },
            { 'name': 'Sun flower', 'value': 'sun flower' },
            { 'name': 'Orange', 'value': 'orange' },
            { 'name': 'Carrot', 'value': 'carrot' },
            { 'name': 'Pumpkin', 'value': 'pumpkin' },
            { 'name': 'Alizarin', 'value': 'alizarin' },
            { 'name': 'Pomegranate', 'value': 'pomegranate' },
            { 'name': 'Clouds', 'value': 'clouds' },
            { 'name': 'Silver', 'value': 'silver' },
            { 'name': 'Concrete', 'value': 'concrete' },
            { 'name': 'Asbestos', 'value': 'asbestos' },
        ]

    }
})();