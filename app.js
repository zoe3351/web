var app = angular.module("catApp", ["ngRoute", "xeditable"]);

// modify this later
const SERVER = "http://bulubulu.ischool.uw.edu:4000/";

app.config(function config($routeProvider, $httpProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "pages/map.html",
            controller: "mapController",
            resolve: {
                phaseAndProposal: function (DataService) {
                    return DataService.getPhaseThenProposal();
                },
            }
        })
        .when("/login", {
            templateUrl: "pages/login.html",
            controller: "loginController"
        })
        .when("/register", {
            templateUrl: "pages/register.html",
            controller: "registerController",
        })
        .when("/forget", {
            templateUrl: "pages/resetpassword.html",
        })
        .when("/profile/:uid", {
            templateUrl: "pages/profile.html",
            controller: "profileController"
        })
        .when("/proposalDetail/:pid", {
            templateUrl: "pages/proposalDetail.html",
            controller: "proposalDetailController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .when("/draftmgt", {
            templateUrl: "pages/draftmgt.html",
            controller: "draftmgtController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .when("/usermgt", {
            templateUrl: "pages/usermgt.html",
            controller: "usermgtController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .when("/finalmgt", {
            templateUrl: "pages/finalmgt.html",
            controller: "finalmgtController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .when("/phasemgt", {
            templateUrl: "pages/phasemgt.html",
            controller: "phasemgtController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .when("/ballot", {
            templateUrl: "pages/ballot.html",
            controller: "ballotController",
            resolve: {
                role: function (DataService) {
                    return DataService.getRole((data) => { return data.data.role });
                },
            }
        })
        .otherwise("/home");

    $httpProvider.defaults.headers.common = { "x-access-token": `${window.localStorage["token"]}` };
});


app.factory("DataService", function ($http) {
    function getAllUser(succCallback, errCallback) {
        return $http.get(SERVER + 'user/all').then(succCallback, errCallback);
    };

    function getUser(uid, succCallback, errCallback) {
        return $http.get(SERVER + 'user/' + uid).then(succCallback, errCallback);
    };

    function getRole(succCallback, errCallback) {
        return $http.get(SERVER + "auth/role", {
            headers: {
                "x-access-token": `${window.localStorage["token"]}`
            }
        }).then(succCallback, errCallback);
    }

    function getDistrict(succCallback, errCallback) {
        return $http.get(SERVER + 'user/allDistrict').then(succCallback, errCallback);
    }

    function getUserDistrict(uid, succCallback, errCallback) {
        return $http.get(SERVER + 'user/district/' + uid).then(succCallback, errCallback);
    }

    function getAllDraft(succCallback, errCallback) {
        return $http.get(SERVER + 'draft/all').then(succCallback, errCallback);
    }

    function getAllFinal(succCallback, errCallback) {
        return $http.get(SERVER + 'final/all').then(succCallback, errCallback);
    }

    function getProposal(pid, succCallback, errCallback) {
        return $http.get(SERVER + 'final/' + pid).then(succCallback, errCallback);
    }

    function getPhase(succCallback, errCallback) {
        return $http.get(SERVER + 'phase/all').then(succCallback, errCallback);
    }

    function getGradeProposals(succCallback, errCallback) {
        $http.get(SERVER + 'stage/grade/p').then(succCallback, errCallback);
    }

    function getVoteProposals(succCallback, errCallback) {
        $http.get(SERVER + 'stage/vote/p').then(succCallback, errCallback);
    }

    function getDisplayProposals(succCallback, errCallback) {
        $http.get(SERVER + 'stage/display/p').then(succCallback, errCallback);
    }

    function getAllUsername(succCallback, errCallback) {
        return $http.get(SERVER + 'user/allUsername').then(succCallback, errCallback);
    }

    function getPhaseThenProposal() {

        let proposalAndPhase = (proposals, phase) => {
            // $scope.$broadcast('dataloaded');
            return {
                phase: phase,
                proposals: proposals,
            }
        }

        return $http.get(SERVER + 'phase/all').then(function (response) {
            let phase = (response.data.data[0]) ? Number(response.data.data[0].current_phase) : 0;
            if (phase == 1) {
                return $http.get(SERVER + 'draft/all').then(function (response) {
                    return proposalAndPhase(response.data.data, phase)
                });

            } else if (phase == 2) {
                return $http.get(SERVER + 'final/grade').then(function (response) {
                    return proposalAndPhase(response.data.data, phase)
                });

            } else if (phase == 3) {
                return $http.get(SERVER + 'final/vote').then(function (response) {
                    return proposalAndPhase(response.data.data, phase)
                });
            } else if (phase == 4) {
                return $http.get(SERVER + 'final/display').then(function (response) {
                    return proposalAndPhase(response.data.data, phase)
                });
            } else {
                return proposalAndPhase([], phase);
            }
        });
    }

    return {
        getAllUser: getAllUser,
        getUser: getUser,
        getRole: getRole,
        getDistrict: getDistrict,
        getUserDistrict: getUserDistrict,
        getAllDraft: getAllDraft,
        getAllFinal: getAllFinal,
        getProposal: getProposal,
        getPhase: getPhase,
        getPhaseThenProposal: getPhaseThenProposal,
        getAllUsername: getAllUsername,
        getGradeProposals: getGradeProposals,
        getVoteProposals, getVoteProposals,
        getDisplayProposals: getDisplayProposals
    };

});

app.controller("mainController", function ($scope, $http, $route, $rootScope, $timeout, $anchorScroll, DataService) {

    if (window.localStorage["token"] !== "") {
        $http
            .get("http://bulubulu.ischool.uw.edu:4000/auth/me")
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                //console.log(data[0]["username"]);
                $rootScope.username = data[0]["username"];
                $rootScope.userId = data[0]["id"];
                DataService.getUserDistrict($rootScope.userId,
                    (data) => {
                        $rootScope.district = (data.data.data[0]) ? data.data.data[0].district_phase3 : 0;
                    },
                    (data) => {
                        alert(data["message"]);
                    });

                DataService.getRole((data) => {
                    $scope.role = data.data.role;
                }, (data) => {
                    alert(data["message"]);
                });
            })
            .error(function (data, status, header, config) {
                //alert(data["message"]);
                window.localStorage["token"] = "";
            });
    }

    if ($rootScope.username) {
        $scope.username = $rootScope.username;
        $scope.userId = $rootScope.userId;
    }

    $scope.signout = function () {
        window.localStorage["token"] = "";
        $rootScope.username = null;
        $scope.username = null;
        location.reload();
    }

    $scope.scrollTo = function (id) {
        $anchorScroll(id);
    }

    DataService.getPhase((response) => {
        $scope.phase = (response.data.data[0]) ? response.data.data[0].current_phase : 0;
        let messages = ['PLEASE WAIT TO BEGIN', 'IDEA COLLECTION', 'PROJECT DEVELOPMENT', 'VOTING', 'FUND IMPLEMENT'];
        $scope.message = messages[$scope.phase];
    });
});