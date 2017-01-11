angular.module('myApp', ['ngRoute', 'ngAnimate'])
    .run(function ($rootScope, $location, $timeout) {
        $rootScope.$on('$routeChangeError', function () {
            $location.path("/error");
        });
        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            $timeout(function () {
                $rootScope.isLoading = false;
            }, 1000);
        });
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: './home.html',
                controller: 'MealCtrl'
            })
            .when('/New-meal', {
                templateUrl: './new_meal.html',
                controller: 'MealCtrl'
            })
            .when('/My-earnings', {
                templateUrl: './my_earnings.html',
                controller: 'EarningsCtrl'
            })
            .otherwise('/', {
                templateUrl: './home.html',
                controller: 'MealCtrl'
            });
    }])
    .controller('MealCtrl', function ($scope, $rootScope) {
        $scope.i = 0;
        // Declaration of all the inputs- Meal details
        $scope.mealPrice;
        $scope.taxRate;
        $scope.tipPercent;

        // Customer Charges
        $scope.subTotal = 0;
        $scope.tipValue = 0; // Tip for one meal
        $scope.totalValue = 0; // Total value of meal price, tax and tip

        // My earnings info
        $rootScope.earnings = {};
        $rootScope.earnings.tipTotalValue = 0; // Total tip for all the meals
        $scope.earnings.mealCount = 0; // No of meals
        $scope.earnings.avgTipValue = 0;

        $scope.completeTransaction = function () {
            $scope.subTotal = ($scope.mealPrice + ($scope.taxRate * 0.01 * $scope.mealPrice));
            $scope.tipValue = ($scope.tipPercent * 0.01 * $scope.mealPrice);
            $scope.totalValue = $scope.subTotal + $scope.tipValue;

            if ($scope.i === 0) { // For the first meal
                $rootScope.earnings.tipTotalValue = $scope.tipValue;
            } else {
                $rootScope.earnings.tipTotalValue += $scope.tipValue;
            }
            $scope.i++;
            $scope.earnings.mealCount = $scope.i;
            $scope.earnings.avgTipValue = $rootScope.earnings.tipTotalValue / $scope.earnings.mealCount;
        };

        $scope.cancelTransaction = function () {
            document.getElementById("enterDetails").reset();
            $scope.form.$submitted = false;
            $scope.mealPrice = 0;
            $scope.taxRate = 0;
            $scope.tipPercent = 0;
        };
    })
    .controller('EarningsCtrl', function ($scope, $rootScope) {
        $rootScope.earnings;
        $scope.resetTransaction = function () {
            $rootScope.earnings = {};
        }
    });
