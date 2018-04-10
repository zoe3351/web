var app = angular.module('catApp', [
    'ngRoute',
    'xeditable',
]);


app.config(function config($routeProvider) {
    $routeProvider.
        when('/home', {
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
        when('/admin', {
            templateUrl: 'pages/admin.html',
            controller: 'adminController'
        }).

        otherwise('/home');
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

app.controller("adminController", function ($scope, $filter, $http) {
    $scope.message = 'admin';

    $http.get('data/proposals.json').then(function (response) {
        $scope.proposals = response.data;
    });

    $scope.users = [
        { id: 1, email: 'awesome user1', phone: 2},
        { id: 2, email: 'awesome user2', phone: 3},
        { id: 3, email: 'awesome user3', phone: 5}
    ];

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };

    $scope.saveUser = function (data, id) {
        //$scope.user not updated yet
        angular.extend(data, { id: id });
        return $http.post('/saveUser', data);
    };

    // remove user
    $scope.removeUser = function (index) {
        $scope.users.splice(index, 1);
    };

    // add user
    $scope.addUser = function () {
        $scope.inserted = {
            id: $scope.users.length + 1,
            name: '',
            status: null,
            group: null
        };
        $scope.users.push($scope.inserted);
    };

    $scope.proposal = null;
    $scope.showPro = (pro)=>{
        $scope.proposal = pro;
        console.log(pro);
    }  

    $scope.phase = 1;

});

app.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);