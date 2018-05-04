var app = angular.module("catApp", ["ngRoute", "xeditable"]);

// modify this later
const SERVER = "http://bulubulu.ischool.uw.edu:4000/";

app.config(function config($routeProvider) {
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
        .when("/profile/:uid", {
            templateUrl: "pages/profile.html",
            controller: "profileController"
        })
        .when("/proposalDetail/:pid", {
            templateUrl: "pages/proposalDetail.html",
            controller: "proposalDetailController",
        })
        .when("/draftmgt", {
            templateUrl: "pages/draftmgt.html",
            controller: "draftmgtController",
        })
        .when("/usermgt", {
            templateUrl: "pages/usermgt.html",
            controller: "usermgtController",
        })
        .when("/finalmgt", {
            templateUrl: "pages/finalmgt.html",
            controller: "finalmgtController",
        })
        .when("/phasemgt", {
            templateUrl: "pages/phasemgt.html",
            controller: "phasemgtController",
        })
        .when("/ballot", {
            templateUrl: "pages/ballot.html",
            controller: "ballotController",
        })
        .otherwise("/home");
});


app.factory("DataService", function ($http) {
    function getAllUser(succCallback, errCallback) {
        return $http.get(SERVER + 'user/all').then(succCallback, errCallback);
    };

    function getUser(uid, succCallback, errCallback) {
        return $http.get(SERVER + 'user/' + uid).then(succCallback, errCallback);
    };

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
            let phase = Number(response.data.data[0].current_phase || -1);
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
                //TODO: select over table phase 4
            } else if (phase == 4) {
                return $http.get(SERVER + 'final/display').then(function (response) {
                    return proposalAndPhase(response.data.data, phase)
                });
            } else {
                return;
            }
        });
    }

    return {
        getAllUser: getAllUser,
        getUser: getUser,
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
            .get("http://bulubulu.ischool.uw.edu:4000/auth/me", {
                headers: {
                    "x-access-token": `${window.localStorage["token"]}`
                }
            })
            .success(function (data, status, headers, config) {
                // $scope.PostDataResponse = data;
                $rootScope.username = data[0]["username"];
                $rootScope.userId = data[0]["id"];
                DataService.getUserDistrict($rootScope.userId,
                    (data) => {
                        $rootScope.district = (data.data.data[0]) ? data.data.data[0].district_phase3 : 0;
                    },
                    (data) => {
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
        $scope.phase = response.data.data[0].current_phase;
        let messages = ['IDEA COLLECTION', 'PROJECT DEVELOPMENT', 'VOTING', 'FUND IMPLEMENT'];
        $scope.message = messages[$scope.phase - 1];
    });
});