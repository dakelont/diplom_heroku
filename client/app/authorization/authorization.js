'use strict';

angular
    .module('myApp')
    .controller('authorizationCtrl', function(ClientService, $location) {/*MenuService , ShoppingCartStore */

        var vm = this;
        console.log("AuthorizationCtrl");
        /*  MenuService.getMenu().then(function(menuData) {
            console.log(menuData);
            vm.menu = menuData.data;
        }); */
       vm.authorization = function (answer, answerForm){
        if(answerForm.$valid){
           /*  console.log(answer); */
            ClientService.userAuthorization(answer).then(function(data) {
                console.log("ClientService:",data);
                /* vm.id = data.data; */
                $location.path('/client/' + data.data);
            });
        }
      };
     
      /*  vm.addToCart = function(pokemon) {
            ShoppingCartStore.addItem(pokemon);
        };
 */
    });
