var app = angular.module('groceryListApp', ["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: "views/groceryList.html",
        controller: "HomeController"
    })
    .when("/addItem", {
        templateUrl: "views/addItem.html",
        controller: "GroceryListItemController"
    })
    .when("/addItem/edit/:id", {
        templateUrl: "views/addItem.html",
        controller: "GroceryListItemController"
    })
    .otherwise({
        redirectTo: "/"
    })
});

app.service("GroceryService", function(){
    
    var groceryService = {};
    
    groceryService.groceryItems = [
        {id: 1, completed: true, itemName: 'milk', date: '2014-10-01'},
        {id: 2, completed: true, itemName: 'cookies', date: '2014-10-02'},
        {id: 3, completed: true, itemName: 'ice cream', date: '2014-10-03'},
        {id: 4, completed: true, itemName: 'potatoes', date: '2014-10-04'},
        {id: 5, completed: true, itemName: 'cereal', date: '2014-10-04'},
        {id: 6, completed: true, itemName: 'bread', date: '2014-10-04'},
        {id: 7, completed: true, itemName: 'eggs', date: '2014-10-05'},
        {id: 8, completed: true, itemName: 'tortillas', date: '2014-10-06'}
    ];
    
    groceryService.findById = function(id){
        for(var item in groceryService.groceryItems){
            if(groceryService.groceryItems[item].id === id)
                return groceryService.groceryItems[item];
        }
    };
    
    groceryService.getNewId = function(){
        if(groceryService.newId){
            groceryService.newId++;
            return groceryService.newId;
        }else{
            var maxId = _.max(groceryService.groceryItems, function(entry){ return entry.id; });
            return groceryService.newId;
        }
    };
    
    groceryService.save = function(entry){
        var updateItem = groceryService.findById(entry.id);
        
        if(updateItem){
            updateItem.completed = entry.completed;
            updateItem.itemName = entry.itemName;
            updateItem.date = entry.date;
        }else{
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
        }
        console.log("updateItem: " + updateItem);
    };
    
    return groceryService;
});

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService){
    $scope.groceryItems = GroceryService.groceryItems;
}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams", "$location", "GroceryService", function($scope, $routeParams, $location, GroceryService){
    
    if(!$routeParams.id){
        $scope.groceryItem = { id: 0, completed:false, itemName: "", date: new Date() }
    }else{
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
    }
        
    $scope.save = function(){
        GroceryService.save( $scope.groceryItem );
        $location.path("/");
    }
    console.log("$routeParams.id: " + $routeParams.id);
}]);