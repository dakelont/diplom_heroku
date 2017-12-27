'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ui.router',
    'ngMessages',
    'btford.socket-io'
]).
config(function($stateProvider) {
    $stateProvider
        .state({
            name: 'authorization',
            url: '',
            templateUrl: 'client/app/authorization/authorization.html',
            controller: 'authorizationCtrl as vm'
        })
        .state({
            name: 'client',
            url: '/client/:id',
            templateUrl: 'client/app/home/home.html',
            controller: 'homeCtrl as vm'
        })
})
.factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect();
  
    return {
      on: function(eventName, callback){
        socket.on(eventName, callback);
      },
      emit: function(eventName, data) {
        socket.emit(eventName, data);
      }
    };
  }]);
