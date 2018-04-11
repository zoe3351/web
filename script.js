var app = angular.module("catApp", ["ngRoute", "xeditable"]);

app.config(function config($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "pages/map.html",
            controller: "mapController"
        })
        .when("/login", {
            templateUrl: "pages/login.html",
            controller: "loginController"
        })
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "registerController"
        })
        .when("/profile", {
            templateUrl: "pages/profile.html",
            controller: "profileController"
        })
        .when("/grade", {
            templateUrl: "pages/map.html",
            controller: "gradeController"
        })
        .when("/vote", {
            templateUrl: "pages/map.html",
            controller: "voteController"
        })
        .when("/display", {
            templateUrl: "pages/map.html",
            controller: "displayController"
        })
        .when("/admin", {
            templateUrl: "pages/admin.html",
            controller: "adminController"
        })
        .otherwise("/home");
});

app.controller("banController", function ($scope) {
    $scope.message = "ban";
});

app.controller("mapController", function ($scope, $http) {
    $scope.message = "map";
    $http.get("data/proposals.json").then(function (response) {
        $scope.proposals = response.data;
    });

    $scope.showNewProposal = false;

    $scope.showNewProposalTab = () => {
        $scope.showNewProposal = true;
    };

    $scope.showProposalListTab = () => {
        $scope.showNewProposal = false;
    };

    $scope.modal = false;
    $scope.openModal = () => {
        $scope.modal = true;
    };

    $scope.closeModal = () => {
        $scope.modal = false;
    };

    $scope.newProposal = {
        title: "",
        idea: "",
        location: "",
        why: "",
        benefit: ""
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            $scope.newProposal.id = Date.now();
            console.log($scope.newProposal);
            $scope.newProposal = {
                title: "",
                idea: "",
                location: "",
                why: "",
                benefit: ""
            };
        }
    };

    if (window.localStorage["token"]) {
        $http
            .get("http://bulubulu.ischool.uw.edu:4000/auth/me", {
                headers: {
                    "x-access-token": `${window.localStorage["token"]}`
                }
            })
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                console.log(data["username"]);
                $scope.username = data[0]["username"];
            })
            .error(function (data, status, header, config) {
                alert(data["message"]);
                window.localStorage["token"] = "";
            });
    }
});

app.controller("loginController", function ($scope, $http, $location) {
    $scope.message = "login";

    $scope.login = () => {
        let config = {
            method: "POST",
            url: "http://bulubulu.ischool.uw.edu:4000/auth/login",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: $scope.username,
                password: $scope.password
            }
        };
        // alert("start login!");
        $http(config)
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                if (data["auth"]) {
                    window.localStorage["token"] = data["token"];
                    $location.path("#/home");
                } else {
                    alert(data);
                }
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    };
    //   .then(function(response) {
    //     $scope.proposals = response.data;
    //   });
});

app.controller("registerController", function ($scope, $http, $location) {
    $scope.message = "register";

    $scope.signup = () => {
        if ($scope.password !== $scope.cm_password) {
            alert("password must be the same!");
            return;
        }
        let config = {
            method: "POST",
            url: "http://bulubulu.ischool.uw.edu:4000/auth/register",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                username: $scope.username,
                password: $scope.password
            }
        };
        // alert("start login!");
        $http(config)
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                if (data["auth"]) {
                    window.localStorage["token"] = data["token"];
                    $location.path("#/home");
                } else {
                    alert(data);
                }
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    };
});

app.controller("profileController", function ($scope) {
    $scope.message = "profile";
});

app.controller("gradeController", function ($scope) {
    $scope.message = "grade";
});

app.controller("voteController", function ($scope) {
    $scope.message = "vote";
});

app.controller("displayController", function ($scope) {
    $scope.message = "display";
});

app.controller("adminController", function ($scope, $filter, $http) {
    $scope.message = 'admin';

    $http.get('data/proposals.json').then(function (response) {
        $scope.proposals = response.data;
    });

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

    $scope.users = [
        { id: 1, name: "awesome user1", status: 2, group: 4, groupName: "admin" },
        {
            id: 2,
            name: "awesome user2",
            status: undefined,
            group: 3,
            groupName: "vip"
        },
        { id: 3, name: "awesome user3", status: 2, group: null }
    ];

    $scope.statuses = [
        { value: 1, text: "status1" },
        { value: 2, text: "status2" },
        { value: 3, text: "status3" },
        { value: 4, text: "status4" }
    ];

    $scope.groups = [];
    $scope.loadGroups = function () {
        return $scope.groups.length
            ? null
            : $http.get("/groups").success(function (data) {
                $scope.groups = data;
            });
    };

    $scope.showGroup = function (user) {
        if (user.group && $scope.groups.length) {
            var selected = $filter("filter")($scope.groups, { id: user.group });
            return selected.length ? selected[0].text : "Not set";
        } else {
            return user.groupName || "Not set";
        }
    };

    $scope.showStatus = function (user) {
        var selected = [];
        if (user.status) {
            selected = $filter("filter")($scope.statuses, { value: user.status });
        }
        return selected.length ? selected[0].text : "Not set";
    };

    $scope.checkName = function (data, id) {
        if (id === 2 && data !== "awesome") {
            return "Username 2 should be `awesome`";
        }
    };

    $scope.saveUser = function (data, id) {
        //$scope.user not updated yet
        angular.extend(data, { id: id });
        return $http.post("/saveUser", data);
    };

    // remove user
    $scope.removeUser = function (index) {
        $scope.users.splice(index, 1);
    };

    // add user
    $scope.addUser = function () {
        $scope.inserted = {
            id: $scope.users.length + 1,
            name: "",
            status: null,
            group: null
        };

        $scope.proposal = null;
        $scope.showPro = (pro) => {
            $scope.proposal = pro;
            console.log(pro);
        }

        $scope.phase = 1;

        $scope.users.push($scope.inserted);
    };
});

app.run([
    "editableOptions",
    function (editableOptions) {
        editableOptions.theme = "bs3"; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
]);
