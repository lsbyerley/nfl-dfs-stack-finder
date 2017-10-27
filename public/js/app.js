
// Declares the initial angular module "YourAppName". Module grabs other controllers and services.
var app = angular.module('DFSOptimizer', ['DFSOptimizer.services','DFSOptimizer.filters','homeCtrl','ui.router','toastr','rzModule'])

    // Configures Angular routing -- showing the relevant view and controller when needed.
    .config(function($stateProvider, $urlRouterProvider){

        $urlRouterProvider.otherwise('/');

    	$stateProvider
    		.state('home', {
    			url: '/',
    			templateUrl: '../views/home.html',
    			controller: 'homeCtrl'
    		})

    })
    // Load the team stacks from local storage if available
    .run(function($rootScope, $window) {
        if ($window.localStorage.teamStacks) {
            $rootScope.teamStacks = JSON.parse($window.localStorage.teamStacks);
        } else {
            $rootScope.teamStacks = [];
        }
    });