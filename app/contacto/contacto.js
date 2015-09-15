(function () {
    'use strict';
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length - 1].src;
    currentScriptPath = currentScriptPath.replace('.min', '');
    angular.module('uiglp.contacto', ['ngRoute'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider.when('/contacto', {
                templateUrl: currentScriptPath.replace('.js', '.html'),
                controller: 'ContactoController',
                data: {requiresLogin:false}
            });
        }])
        .controller('ContactoController', ContactoController);


    ContactoController.$inject = ['LoginService', 'LoginState', 'store', '$http', '$timeout'];
    function ContactoController(LoginService, LoginState, store, $http, $timeout) {

        var vm = this;
        vm.sendMail = sendMail;

        function sendMail() {

            //console.log(vm.mail);
            return $http.post('./contacto/contact.php',
                {'email': vm.email, 'nombre': vm.nombre, 'mensaje': vm.mensaje, 'asunto': vm.asunto})
                .success(
                function (data) {
                    console.log(data);
                    vm.enviado = true;
                    $timeout(hideMessage, 3000);
                    function hideMessage(){
                        vm.enviado = false;
                    }

                    vm.email = '';
                    vm.nombre = '';
                    vm.mensaje = '';
                    vm.asunto = '';

                    //goog_report_conversion('http://www.ac-desarrollos.com/#');
                })
                .error(function (data) {
                    console.log(data);
                });
        }
    }
})();