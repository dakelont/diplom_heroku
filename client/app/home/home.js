'use strict';

angular
    .module('myApp')
    .controller('homeCtrl', function(ClientService,$stateParams, socket, $scope, $interval) {

        var vm = this;
        vm.user = {id:$stateParams.id};

        vm.showOrder = {myOrder: true};

        ClientService.getUser(vm.user.id)
            .then(function(userData) {
                vm.user = userData.data;
            });

        vm.addMany = function() {
            socket.emit('addMany', '');
        };

        vm.addToBasket = function(id) {
            socket.emit('addToBasket', id);
        }
        socket.on('addToBasket', function(data) {
        });
        vm.myOrder =function() {
            vm.showOrder = {myOrder: true};
        }
        vm.addToOrder =function() {
            socket.emit('addToOrder', '');
        }
        
        socket.on('addToOrder', function(data) {
            vm.food = data;
            vm.showOrder = {myOrder: false};
            $scope.$apply(vm.food);
        });

        socket.on('addMany', function(data) {
            vm.user.many = data;
            $scope.$apply(vm.user.many);
        });
        $interval(function() {
            socket.emit('getUserDataBasket', '');
        },2000);
        
        socket.on('getUserDataBasket', function(data) {
            vm.user.basket = data;
            $scope.$apply(vm.user.basket);
        });
        

    });
