(function () {
    'use strict';

    angular
        .module('formBuilder')
        .controller('ColorSelectController', ColorSelectController);

    ColorSelectController.$inject = ['$uibModalInstance', '$rootScope'];
    function ColorSelectController($uibModalInstance, $rootScope) {
        var vm = this;


        activate();

        ////////////////

        function activate() {



            vm.colors = [
                { 'color': 'turquoise', 'value': '#1abc9c' },
                { 'color': 'emerald', 'value': '#2ecc71' },
                { 'color': 'amethyst', 'value': '#9b59b6' },
                { 'color': 'peter-river', 'value': '#3498db' },
                { 'color': 'wet-asphalt', 'value': '#34495e' },
                { 'color': 'green-sea', 'value': '#16a085' },
                { 'color': 'nephritis', 'value': '#27ae60' },
                { 'color': 'wisteria', 'value': '#8e44ad' },
                { 'color': 'belize hole', 'value': '#2980b9' },
                { 'color': 'midnight-blue', 'value': '#2c3e50' },
                { 'color': 'sun flower', 'value': '#f1c40f' },
                { 'color': 'carrot', 'value': '#e67e22' },
                { 'color': 'alizarin', 'value': '#e74c3c' },
                { 'color': 'clouds', 'value': '#ecf0f1' },
                { 'color': 'concrete', 'value': '#95a5a6' },
                { 'color': 'orange', 'value': '#f39c12' },
                { 'color': 'pumpkin', 'value': '#d35400' },
                { 'color': 'pomegranate', 'value': '#c0392b' },
                { 'color': 'silver', 'value': '#bdc3c7' },
                { 'color': 'asbestos', 'value': '#7f8c8d' },
            ];

            vm.currentColor = vm.colors[0];

            vm.selectColor = function (index, color) {
                $(".color-active").removeClass("color-active")
                $('.color-box:eq(' + index + ')').addClass("color-active");
                vm.currentColor = color;
            }

            vm.close = function () {

                $rootScope.$broadcast('select-form-name-color', vm.currentColor.value);
                $uibModalInstance.dismiss();
            }

        }
    }
})();