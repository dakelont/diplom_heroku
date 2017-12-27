'use strict';

angular
    .module('myApp')
    .controller('homeCtrl', function(ClientService,$stateParams, socket, $scope, $interval) {/*MenuService , ShoppingCartStore */

        var vm = this;

        socket.emit('allOrder', '');
        socket.on('allOrder', function(data) {
            vm.allOrder = data;
            $scope.$apply(vm);
        });
        
        $interval(function() {
            socket.emit('allOrder', '');
        },2000);

        vm.startCooking = function(id) {
            socket.emit('startCooking', id);
            socket.emit('allOrder', '');
        };

        vm.stopCooking = function(id) {
            socket.emit('stopCooking', id);
            socket.emit('allOrder', '');
        }

        

    });
