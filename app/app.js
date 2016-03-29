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


        var currentDate = Date.now();
        var date_time = convertDate(currentDate) + ' ' + getTime(currentDate);

        myDataRef.push({
            id: id,
            name: 'ac-desarrollos',
            message: mensajeInput[0].value,
            mail: 'ventas@ac-desarrollos.com',
            date_time: date_time,
            chat_type: 2});

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

            //sendMail( mensaje.mail, mensaje.name);

            var messagesList = angular.element(document.querySelector('#chats'));
            messagesList.append('<div class="chat-container" id="container-' + mensaje.id + '">' +
                '<div id="messages-' + mensaje.id + '"></div>' +
                '<div class="chat-mensaje">' +
                '<button id="close-' + mensaje.id + '">X</button>' +
                '<input ng-model="appCtrl.mensaje" id="input-' + mensaje.id + '" type="text">' +
                '</div></div>');


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


        //appendMessage(mensaje.id, mensaje.name, mensaje.message);
        appendMessage(mensaje);
    });

    function appendMessage(mensaje) {
        var messages = angular.element(document.querySelector('#messages-' + mensaje.id));
        if(mensaje.chat_type == 1)
            messages.append('<div class="chat-cliente"><p>' + mensaje.name + ' dice: ' + mensaje.message + '</p><p class="chat-hora">' + mensaje.date_time + '</p></div>');
        else
            messages.append('<div class="chat-ac"><p>' + mensaje.name + ' dice: ' + mensaje.message + '</p><p class="chat-hora">' + mensaje.date_time + '</p></div>');

        if (!$scope.$$phase) {
            //$digest or $apply
            $scope.$apply();
        }
    }

    /*
    function appendMessage(id, nombre, text) {
        var messages = angular.element(document.querySelector('#messages-' + id));
        messages.append('<p>' + nombre + ' dice: ' + text + '</p>');
        if (!$scope.$$phase) {
            //$digest or $apply
            $scope.$apply();
        }
    }
    */


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

    function convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    function getTime(dateTime) {
        function pad(s) { return (s < 8) ? '0' + s : s; }
        var d = new Date(dateTime);
        return [pad(d.getHours()), pad(d.getMinutes()+1), d.getSeconds()].join(':');
    }

}
