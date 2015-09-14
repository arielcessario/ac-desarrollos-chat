'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .controller('AppController', AppController);


AppController.$inject = ['$scope'];
function AppController($scope) {
    var myDataRef = new Firebase('https://chat-acdesarrollos.firebaseio.com/');

    var vm = this;

    vm.enviar = enviar;
    vm.mensaje = '';
    vm.ventana01 = '';
    vm.idChats = [];


    function enviar(id) {

        console.log(id);
        var mensajeInput = angular.element(document.querySelector('#input-' + id));


        myDataRef.push({id:id, name: 'Ariel', message: mensajeInput[0].value, mail: 'ventas@ac-desarrollos.com'});
    }

    myDataRef.on('child_added', function (snapshot) {
        var mensaje = snapshot.val();
        var encontrado = false;


        for (var i = 0; i < vm.idChats.length; i++) {
            if (vm.idChats[i] == mensaje.id) {
                encontrado = true;
            }
        }

        if (!encontrado) {
            vm.idChats.push(mensaje.id);
            var messagesList = angular.element(document.querySelector('#chats'));
            messagesList.append('<div class="chat-container">' +
                '<div id="messages-' + mensaje.id + '"></div>' +
                '<input ng-model="appCtrl.mensaje" id="input-' + mensaje.id + '" type="text">' +
                '<button id="btn-'+mensaje.id+'">Enviar</button>' +
                '</div>');


            var button = angular.element(document.querySelector('#btn-'+mensaje.id));
            button.bind('click', function(){
                enviar(mensaje.id);
            });
        }

        appendMessage(mensaje.id, mensaje.name, mensaje.message);
    });

    function appendMessage(id, nombre, text) {
        var messages = angular.element(document.querySelector('#messages-' + id));
        messages.append('<p>' + nombre + ' dice: ' + text + '</p>');
        if (!$scope.$$phase) {
            //$digest or $apply
            $scope.$apply();
        }
    }
}
