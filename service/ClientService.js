angular
.module('myApp')
.factory('ClientService', function($http) {
    var vm = this;
    return {
        getMenu: function() {
            return $http.get('/drone-cafe/menu.json');
        },
        /* getMenu: function(menuId) {
            console.log("getMenu:", menuId);
            return $http.get('/drone-cafe/menu.json');
        }, */
        userAuthorization: function(data) {
            return $http.post('/users',data);
        },
        getUser: function(id) {
            return $http.get('/users/'+ id);
        }
    }
});
