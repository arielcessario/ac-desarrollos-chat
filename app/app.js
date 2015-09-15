'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .controller('AppController', AppController);


AppController.$inject = ['$scope', '$http'];
function AppController($scope, $http) {
    var myDataRef = new Firebase('https://chat-acdesarrollos.firebaseio.com/');

    var vm = this;

    vm.enviar = enviar;
    vm.mensaje = '';
    vm.ventana01 = '';
    vm.idChats = [];


    function enviar(id) {

        //console.log(id);
        var mensajeInput = angular.element(document.querySelector('#input-' + id));


        myDataRef.push({id: id, name: 'Ariel', message: mensajeInput[0].value, mail: 'ventas@ac-desarrollos.com'});
        mensajeInput[0].value = '';
    }


    //myDataRef.on("value", function(snapshot) {
    //    console.log(snapshot.val());
    //}, function (errorObject) {
    //    console.log("The read failed: " + errorObject.code);
    //});


    myDataRef.on('child_added', function (snapshot) {
        var mensaje = snapshot.val();
        var encontrado = false;

        //console.log(snapshot.key());


        for (var i = 0; i < vm.idChats.length; i++) {
            if (vm.idChats[i] == mensaje.id) {
                encontrado = true;
            }
        }

        if (!encontrado) {
            vm.idChats.push(mensaje.id);

            sendMail( mensaje.mail, mensaje.name);

            var messagesList = angular.element(document.querySelector('#chats'));
            messagesList.append('<div class="chat-container" id="container-' + mensaje.id + '">' +
                '<button id="close-' + mensaje.id + '">X</button>' +
                '<div id="messages-' + mensaje.id + '"></div>' +
                '<input ng-model="appCtrl.mensaje" id="input-' + mensaje.id + '" type="text">' +
                '</div>');


            var input = angular.element(document.querySelector('#input-' + mensaje.id));
            input.bind('keypress', function (event) {

                if (event.keyCode == 13) {
                    enviar(mensaje.id);

                }
            });

            var button = angular.element(document.querySelector('#close-' + mensaje.id));
            button.bind('click', function (event) {

                var r = confirm('Realmente desea borrar el chat?');
                if (!r) {
                    return;
                }

                myDataRef.orderByValue().on("value", function (snapshot_to_delete) {
                    snapshot_to_delete.forEach(function (data) {
                        //console.log("The " + data.key() + " dinosaur's score is " + data.val().id);
                        //messagesList.remove()
                        if (data.val().id == mensaje.id) {
                            console.log(data.key());
                            var refToRemove = new Firebase('https://chat-acdesarrollos.firebaseio.com/' + data.key());
                            refToRemove.remove();
                            //data.set(null);
                            var chat = angular.element(document.querySelector('#container-' + mensaje.id));
                            chat.remove();
                        }


                    });
                    //console.log(snapshot_to_delete.val());
                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });
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


    function sendMail(email, nombre) {

        //console.log(vm.mail);
        return $http.post('./contacto/contact.php',
            {'email': email, 'nombre': nombre, 'mensaje': 'http://192.185.67.199/~arielces/ac-desarrollos-chat/', 'asunto': 'Nuevo chat de cliente'})
            .success(
            function (data) {
                console.log(data);
                //vm.enviado = true;
                //$timeout(hideMessage, 3000);
                //function hideMessage(){
                //    vm.enviado = false;
                //}

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
