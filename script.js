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
                phase: function (DataService) {
                    return DataService.getPhase();
                }
            }
        })
        .otherwise("/home");
});


app.factory("DataService", function ($http) {
    function getAllUser() {
        return $http.get(SERVER + 'user/all').then(function (response) {
            return response.data.data;
        });
    };

    function getAllDraft() {
        return $http.get(SERVER + 'draft/all').then(function (response) {
            return response.data.data;
        });
    }

    function getAllFinal() {
        return $http.get(SERVER + 'final/all').then(function (response) {
            return response.data.data;
        });
    }

    function getProposal(pid) {
        return $http.get(SERVER + 'final/' + pid).then(function (response) {
            return response.data.data[0];
        });
    }

    function getPhase() {
        return $http.get(SERVER + 'phase/all').then(function (response) {
            return response.data.data[0];
        });
    }

    function getPhaseThenProposal() {
        return $http.get(SERVER + 'phase/all').then(function (response) {
            let phase = Number(response.data.data[0].current_phase);
            if (phase == 1) {
                return $http.get(SERVER + 'draft/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });

                //TODO: select over table phase 2
            } else if (phase == 2) {
                return $http.get(SERVER + 'final/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });

                //TODO: select over table phase 3
            } else if (phase == 3) {
                return $http.get(SERVER + 'final/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });
                ////TODO: select over table phase 4
            } else if (phase == 4) {
                return $http.get(SERVER + 'final/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });

            }
        });
    }

    return {
        getAllUser: getAllUser,
        getAllDraft: getAllDraft,
        getAllFinal: getAllFinal,
        getProposal: getProposal,
        getPhase: getPhase,
        getPhaseThenProposal: getPhaseThenProposal
    };

});

app.controller("mapController", function ($scope, $http, $route, phaseAndProposal) {
    $scope.phase = phaseAndProposal.phase;

    $scope.proposals = phaseAndProposal.proposals;

    let convert = function (data) {
        let proposals = []
        for (var d of data) {
            proposals.push(d.proposal_id);
        }
        return proposals;
    }

    $scope.vote = function (pid) {
        if (!$scope.userId) {
            alert("Please Signin!");
            return;
        }
        // check if user has voted more than suggested times
        $http.get(SERVER + 'vote/check/' + $scope.userId)
            .success((res, status, headers, config) => {
                let votedProposals = convert(res.data);
                if (votedProposals.includes(pid)) {
                    alert("You have already voted this proposal!");
                    return;
                }
                if (votedProposals.length >= 3) {
                    alert("You have already voted for 3 proposals!");
                    return;
                }
                voteCallback(pid);
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    }

    let voteCallback = function (pid) {
        if (confirm("Do you want to vote for proposal " + pid + " ?")) {
            $http.post(SERVER + 'vote/' + $scope.userId + '&' + pid)
                .success((data, status, headers, config) => {
                    alert("Vote recorded, thank you!");
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(data);
                });
        }
    }

    $scope.grade = function (pid) {
        if (!$scope.userId) {
            alert("Please Signin!");
            return;
        }

        let score1 = prompt("*Question2: Please grade proposal " + pid + " on Need at Location(from 0 to 10): ", "");

        if (score1 === null || score1 == "") return;

        if (Number(score1) <= 10 && Number(score1) >= 0) {
            let score2 = prompt("*Question1: Please grade proposal " + pid + " on Community Benefit(from 0 to 10): ", "");

            if (score2 === null || score2 == "") return;

            if (Number(score2) <= 10 && Number(score2) >= 0) {
                let body = {
                    grade_Need_at_location: Number(score1),
                    grade_Community_Benefit: Number(score2)
                }
                $http.post(SERVER + 'grade/' + $scope.userId + '&' + pid, body)
                    .success((data, status, headers, config) => {
                        alert("Grade recorded, thank you!");
                        $route.reload();
                    })
                    .error(function (data, status, header, config) {
                        alert(data);
                    });
            } else {
                alert("Wrong score!");
            }

        } else {
            alert("Wrong score!");
        }
    }

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
                console.log(data);
                $scope.username = data[0]["username"];
                $scope.userId = data[0]["id"];

            })
            .error(function (data, status, header, config) {
                alert(data["message"]);
                window.localStorage["token"] = "";
            });
    }
});

app.controller("proposalDetailController", function ($scope, $http, $routeParams, $route, proposal) {
    $scope.pid = $routeParams.pid;
    $scope.proposal = proposal;

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

app.controller("adminController", function ($scope, $filter, $http, $anchorScroll, $location, $route, $window, allUser, allDraft, allFinal, phase) {
    // phase mgt part
    $scope.originPhase = Number(phase.current_phase)
    $scope.phase = Number(phase.current_phase);

    $scope.changePhase = function () {
        $http.post(SERVER + 'phase/editCurrentPhase/' + phase.current_phase + '&' + $scope.phase)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    }

    $scope.endDates = [{
        phase1_end: phase.phase1_end,
        phase2_end: phase.phase2_end,
        phase3_end: phase.phase3_end,
    }];

    $scope.saveDate = function (data) {
        $http.post(SERVER + 'phase/editEndDates/' + phase.current_phase, data)
            .success((data, status, headers, config) => {
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(data);
            });
    }

    // final mgt part
    $scope.allFinal = allFinal;

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

    $scope.upload = function () {
        let uploadInput = angular.element(document.getElementById('uploadInput'))[0];

        if (uploadInput.files.length > 0) {
            let uploadInputFile = uploadInput.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                console.log(event.target.result);
                //TODO: POST
            }

            reader.readAsArrayBuffer(uploadInputFile);
        }

    }


    // draft mgt part
    $scope.allDraft = allDraft;

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
    $scope.allUser = allUser;

    $scope.saveUser = function (data, id) {
        let body = {
            username: data.username,
            phone: data.phone,
            email: data.email
        }

        if (!id) {
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
            user_system_id: null,
            account_name: "",
            user_email: null,
            user_phone_number: null
        };
        $scope.allUser.push($scope.inserted);
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
