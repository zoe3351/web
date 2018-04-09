var app = angular.module('catApp', [
    'ngRoute'
]);


app.config(function config($routeProvider) {
    $routeProvider.
        when('/', {
            templateUrl: 'pages/map.html',
            controller: 'mapController'
        }).
        when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        }).
        when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'registerController'
        }).
        when('/profile', {
            templateUrl: 'pages/profile.html',
            controller: 'profileController'
        }).
        when('/grade', {
            templateUrl: 'pages/map.html',
            controller: 'gradeController'
        }).
        when('/vote', {
            templateUrl: 'pages/map.html',
            controller: 'voteController'
        }).
        when('/display', {
            templateUrl: 'pages/map.html',
            controller: 'displayController'
        }).

        otherwise('/');
});

app.controller("banController", function ($scope) {
    $scope.message = 'ban';
});


app.controller("mapController", function ($scope, $http) {
    $scope.message = 'map';
    $http.get('data/proposals.json').then(function (response) {
        $scope.proposals = response.data;
    });

    $scope.showNewProposal = false;

    $scope.showNewProposalTab = () => {
        $scope.showNewProposal = true;
    }

    $scope.showProposalListTab = () => {
        $scope.showNewProposal = false;
    }

    $scope.modal = false;
    $scope.openModal = () => {
        $scope.modal = true;
    }

    $scope.closeModal = () => {
        $scope.modal = false;
    }

    $scope.newProposal = {
        title: "",
        idea: "",
        location: "",
        why: "",
        benefit: ""
    }

    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.newProposal.id = Date.now();
            console.log($scope.newProposal)
            $scope.newProposal = {
                title: "",
                idea: "",
                location: "",
                why: "",
                benefit: ""
            }

        }
    };
});

app.controller("loginController", function ($scope) {
    $scope.message = 'login';
});

app.controller("registerController", function ($scope) {
    $scope.message = 'register';
});

app.controller("profileController", function ($scope) {
    $scope.message = 'profile';
});

app.controller("gradeController", function ($scope) {
    $scope.message = 'grade';
});

app.controller("voteController", function ($scope) {
    $scope.message = 'vote';
});

app.controller("displayController", function ($scope) {
    $scope.message = 'display';
});

