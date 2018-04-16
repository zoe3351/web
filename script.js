var app = angular.module("catApp", ["ngRoute", "xeditable"]);

// modify this later
const SERVER = "http://localhost:8000/";

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
        .when("/proposalDetail/:pid", {
            templateUrl: "pages/proposalDetail.html",
            controller: "proposalDetailController",
            resolve: {
                proposal: function (DataService, $route) {
                    return DataService.getProposal($route.current.params.pid);
                },
            }
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
            controller: "adminController",
            resolve: {
                allUser: function (DataService) {
                    return DataService.getAllUser();
                },
                allDraft: function (DataService) {
                    return DataService.getAllDraft();
                },
                allFinal: function (DataService) {
                    return DataService.getAllFinal();
                },
            }
        })
        .otherwise("/home");
});


// create an awesome InboxService to fetch our messages
app.factory("DataService", function ($http) {
    function getAllUser() {
        return $http.get(SERVER + 'user/all').then(function (response) {
            return response.data;
        });
    };

    function getAllDraft() {
        return $http.get(SERVER + 'draft/all').then(function (response) {
            return response.data;
        });
    }

    function getAllFinal() {
        return $http.get(SERVER + 'final/all').then(function (response) {
            return response.data;
        });
    }

    function getProposal(pid) {
        return $http.get(SERVER + 'final/' + pid).then(function (response) {
            return response.data;
        });
    }

    return {
        getAllUser: getAllUser,
        getAllDraft: getAllDraft,
        getAllFinal: getAllFinal,
        getProposal: getProposal
    };

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

app.controller("proposalDetailController", function ($scope, $http, $routeParams, $route, proposal) {
    $scope.pid = $routeParams.pid;
    $scope.proposal = proposal.data[0];

    $scope.editable = false;

    $scope.edit = function () {
        $scope.editable = true;
    }

    $scope.submitForm = function (valid) {
        var body = $scope.proposal;
        if (valid) {
            $http.post(SERVER + 'final/edit/' + $scope.proposal.proposal_id
                , body)
                .success((data, status, headers, config) => {
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(data);
                });
        }

    }

})

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
    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.phone = "";

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
                password: $scope.password,
                email: $scope.email,
                phone: $scope.phone
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

app.controller("adminController", function ($scope, $filter, $http, $anchorScroll, $location, $route, $window, allUser, allDraft, allFinal) {
    // final mgt part
    $scope.allFinal = allFinal.data;

    $scope.open = function (id) {
        $window.open('#/proposalDetail/' + id, '_blank');
    }

    $scope.removeFinal = function (id) {
        $http.post(SERVER + 'final/rm/' + id)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    };

    // draft mgt part
    $scope.allDraft = allDraft.data;

    $scope.saveDraft = function (data, id) {
        let body = {
            draft_id: id,
            proposal_title: data.proposal_title,
            proposal_idea: data.proposal_idea,
            project_location: data.project_location,
            proposal_latitude: data.proposal_latitude,
            proposal_longitude: data.proposal_longitude
        }

        $http.post(SERVER + 'draft/edit/' + id, body)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    };

    $scope.removeDraft = function (id) {
        $http.post(SERVER + 'draft/rm/' + id)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    };

    // user mgt part
    $scope.allUser = allUser.data;

    $scope.saveUser = function (data, id) {
        let body = {
            username: data.username,
            phone: data.phone,
            email: data.email
        }

        if (id >= $scope.allUser[$scope.allUser.length - 1].user_system_id) {
            $http.post(SERVER + 'user/add/' + id, body)
                .success((data, status, headers, config) => {
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(data);
                });;
        } else {
            $http.post(SERVER + 'user/edit/' + id, body)
                .success((data, status, headers, config) => {
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(data);
                });;
        }
    };

    // remove user
    $scope.removeUser = function (id) {
        $http.post(SERVER + 'user/rm/' + id)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });;
    };

    // add new user
    $scope.addUser = function () {
        $scope.inserted = {
            user_system_id: $scope.allUser[$scope.allUser.length - 1].user_system_id + 1,
            account_name: "",
            user_email: null,
            user_phone_number: null
        };
        $scope.allUser.push($scope.inserted);
    };


    $scope.phase = 1;

    $http.get('data/proposals.json').then(function (response) {
        $scope.all_finals = response.data;
    });

    // get all draft proposals
    $http.get('data/proposals.json').then(function (response) {
        $scope.all_drafts = response.data;
    });

    if (window.localStorage["token"]) {
        $http
            .get("http://bulubulu.ischool.uw.edu:4000/auth/me", {
                headers: {
                    "x-access-token": `${window.localStorage["token"]}`
                }
            })
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                console.log(data);
                $scope.username = data[0]["username"];
                // TODO: set admin page visible only to admin user
            })
            .error(function (data, status, header, config) {
                alert(data["message"]);
                window.localStorage["token"] = "";
            });
    }

    $scope.scrollTo = function (id) {
        $location.hash(id);
        $anchorScroll();
    }

    $scope.upload = function () {
        var uploadInputFile = angular.element(document.getElementById('uploadInput'))[0].files[0];
        var reader = new FileReader();

        reader.onload = function (event) {
            console.log(event.target.result);
            //TODO: POST
        }

        reader.readAsArrayBuffer(uploadInputFile);
    }

    $scope.message = 'admin';

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };
});

app.run([
    "editableOptions",
    function (editableOptions) {
        editableOptions.theme = "bs3"; // bootstrap3 theme. Can be also 'bs2', 'default'
    }
]);
