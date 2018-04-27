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
        .when("/profile", {
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
        return $http.get(SERVER + 'phase/all').then(function (response) {
            let phase = Number(response.data.data[0].current_phase || -1);
            if (phase == 1) {
                return $http.get(SERVER + 'draft/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });

            } else if (phase == 2) {
                return $http.get(SERVER + 'final/grade').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });

            } else if (phase == 3) {
                return $http.get(SERVER + 'final/vote').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });
                //TODO: select over table phase 4
            } else if (phase == 4) {
                return $http.get(SERVER + 'final/all').then(function (response) {
                    let proposals = response.data.data;
                    return {
                        phase: phase,
                        proposals: proposals
                    }
                });
            } else {
                return;
            }
        });
    }

    return {
        getAllUser: getAllUser,
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

app.controller("mainController", function ($scope, $http, $route, $rootScope, $timeout) {

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
            })
            .error(function (data, status, header, config) {
                alert(data["message"]);
                window.localStorage["token"] = "";
            });
    }

    if ($rootScope.username) {
        $scope.username = $rootScope.username;
    }

    $scope.signout = function () {
        window.localStorage["token"] = "";
        $rootScope.username = null;
        $scope.username = null;
        location.reload();
    }
});

app.controller("mapController", function ($scope, $http, $route, $rootScope, $timeout, phaseAndProposal) {
    $scope.phase = phaseAndProposal.phase;

    $scope.proposals = phaseAndProposal.proposals;

    initMap();
    // choose one proposal to render at the top of list
    $timeout(() => {
        let parent = document.getElementById("scrollbody");
        let someElement = document.getElementById("p17-044");
        parent.scrollTop += someElement.offsetTop - someElement.offsetHeight;
        someElement.children[1].classList.add('show');
    }, 1000);

    let convert = function (data) {
        let proposals = []
        for (var d of data) {
            proposals.push(d.proposal_id);
        }
        return proposals;
    }

    $scope.vote = function (pid) {
        if (!$rootScope.userId) {
            alert("Please Signin!");
            return;
        }
        // check if user has voted more than suggested times
        $http.get(SERVER + 'vote/check/' + $rootScope.userId)
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
                alert(JSON.stringify(data));
            });
    }

    let voteCallback = function (pid) {
        if (confirm("Do you want to vote for proposal " + pid + " ?")) {
            $http.post(SERVER + 'vote/' + $rootScope.userId + '&' + pid)
                .success((data, status, headers, config) => {
                    alert("Vote recorded, thank you!");
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(JSON.stringify(data));
                });
        }
    }

    let gradeCallBack = function (pid) {
        let score1 = prompt("*Question1: Please grade proposal " + pid + " on Community Benefit(from 0 to 10): ", "");

        if (score1 === null || score1 == "") return;

        if (Number(score1) <= 10 && Number(score1) >= 0) {
            let score2 = prompt("*Question2: Please grade proposal " + pid + " on Need at Location(from 0 to 10): ", "");

            if (score2 === null || score2 == "") return;

            if (Number(score2) <= 10 && Number(score2) >= 0) {
                let body = {
                    grade_Need_at_location: Number(score1),
                    grade_Community_Benefit: Number(score2)
                }
                $http.post(SERVER + 'grade/' + $rootScope.userId + '&' + pid, body)
                    .success((data, status, headers, config) => {
                        alert("Grade recorded, thank you!");
                        $route.reload();
                    })
                    .error(function (data, status, header, config) {
                        alert(JSON.stringify(data));
                    });
            } else {
                alert("Wrong score!");
            }

        } else {
            alert("Wrong score!");
        }
    }

    $scope.grade = function (pid) {
        if (!$rootScope.userId) {
            alert("Please Signin!");
            return;
        }

        // check if user has graded the same proposal
        $http.get(SERVER + 'grade/check/' + $rootScope.userId)
            .success((res, status, headers, config) => {
                let gradedProposals = convert(res.data);
                if (gradedProposals.includes(pid)) {
                    alert("You have already graded this proposal!");
                    return;
                }
                gradeCallBack(pid);
            })
            .error(function (data, status, header, config) {
                alert(JSON.stringify(data));
            });
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
        id: (new Date()).toISOString(),
        title: "",
        idea: "",
        location: "",
        latitude: "0",
        longitude: "0"
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            let body = {
                draft_id: (new Date()).toISOString(),
                proposal_title: $scope.newProposal.title,
                proposal_idea: $scope.newProposal.idea,
                proposal_latitude: $scope.newProposal.latitude,
                proposal_longitude: $scope.newProposal.longitude,
                project_location: $scope.newProposal.location,
            }

            $http.post(SERVER + 'draft/add', body)
                .success(function (data, status, headers, config) {
                    alert("Proposal Submitted!");
                    $scope.newProposal = {
                        id: (new Date()).toISOString(),
                        title: "",
                        idea: "",
                        location: "",
                        latitude: "0",
                        longitude: "0"
                    };
                })
                .error(function (data, status, header, config) {
                    alert(JSON.stringify(data));
                });


        }
    };

    /*
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
    }*/
});

app.controller("proposalDetailController", function ($scope, $http, $routeParams, $route, DataService) {
    $scope.pid = $routeParams.pid;
    $scope.proposal = DataService.getProposal($scope.pid, function (response) {
        $scope.proposal = response.data.data[0];
    });

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
                    alert(JSON.stringify(data));
                });
        }

    }

})

app.controller("ballotController", function ($scope, $http, $routeParams, $route, DataService) {

    let initBallot = function () {
        $scope.ballot = {
            firstname: "",
            lastname: "",
            grade: "",
            score1: "",
            score2: "",
            vote: ""
        };
    }

    initBallot();

    let convertVote = function (data) {
        if (data != "") {
            data = data.trim().split(/\s+/g);
            return data;
        }
        return [];
    }

    let checkGrade = function (body) {
        if (body.firstname != "" && body.lastname != "" && body.grade != ""
            && body.score1 >= 0 && body.score1 <= 10
            && body.score2 >= 0 && body.score2 <= 10) return true;
        return false;
    }

    let checkVote = function (body) {
        if (body.firstname != "" && body.lastname != "" && body.vote != "") return true;
        return false;
    }

    let createUser = function (body, callback) {
        let newUser = {
            username: "",
            phone: 0,
            email: "admin@com",
            first_name: $scope.ballot.firstname,
            last_name: $scope.ballot.lastname
        };

        $http.post(SERVER + 'user/add', newUser)
            .success((data, status, headers, config) => {
                console.log(data);
                let uid = data.data[0].user_system_id;
                callback(uid, body);
            })
            .error(function (data, status, header, config) {
                console.log(data);
                alert(JSON.stringify(data));
            });
    }

    $scope.submitForm = function (valid) {
        if (valid) {
            let body = {
                firstname: $scope.ballot.firstname,
                lastname: $scope.ballot.lastname,
                grade: $scope.ballot.grade,
                score1: Number($scope.ballot.score1),
                score2: Number($scope.ballot.score2),
                vote: convertVote($scope.ballot.vote)
            }

            // TODO
            if (checkGrade(body)) {
                let callback = function (uid, body) {
                    $http.post(SERVER + 'grade/' + uid + '&' + body.grade, {
                        grade_Need_at_location: body.score1,
                        grade_Community_Benefit: body.score2
                    })
                        .success((data, status, headers, config) => {
                            alert("Grade Recorded!");
                initBallot();
                        })
                        .error(function (data, status, header, config) {
                            alert(JSON.stringify(data));
                        });
                }

                createUser(body, callback);
            } else if (checkVote(body)) {
                let callback = function (uid, body) {
                    for (let pid of body.vote) {
                        $http.post(SERVER + 'vote/' + uid + '&' + pid)
                            .success((data, status, headers, config) => {
                                alert("Vote for proposal: " + pid + " recorded!");
                initBallot();
                            })
                            .error(function (data, status, header, config) {
                                alert(JSON.stringify(data));
                            });
                    }
                }
                createUser(body, callback);
            } else {
                alert("Please check your input!");
            }
        }
    }

});

app.controller("loginController", function ($scope, $http, $location, $route) {
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
                    location.reload();
                    $location.path("#home");
                } else {
                    alert(data);
                }
            })
            .error(function (data, status, header, config) {
                alert(JSON.stringify(data));
            });
    };
    //   .then(function(response) {
    //     $scope.proposals = response.data;
    //   });
});

app.controller("registerController", function ($scope, $http, $location, DataService) {
    $scope.username = "";
    $scope.password = "";
    $scope.email = "";
    $scope.phone = "";

    // check if username has already been used
    DataService.getAllUsername(function (response) {
        $scope.allUsername = response.data.data;
    }, function (res) {
        allert("can't get allusername!");
    });

    $scope.usernameCanUse = true;
    $scope.pass = function () {
        for (let name of $scope.allUsername) {
            if (name.account_name == $scope.username) {
                $scope.usernameCanUse = false;
                return;
            }
        }
        $scope.usernameCanUse = true;
    };

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
                    location.reload();
                    $location.path("#home");
                } else {
                    alert(data);
                }
            })
            .error(function (data, status, header, config) {
                alert(JSON.stringify(data));
            });
    };
});

app.controller("profileController", function ($scope) {
    $scope.message = "profile";
});

app.controller("draftmgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {
    $scope.allDraft = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllDraft(function (response) {
        $scope.allDraft = response.data.data;
    }, errCallback);

    // draft mgt part
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
                alert("Draft updated!")
            })
            .error(errCallback);
    };

    $scope.removeDraft = function (id) {
        if (!confirm("Do you want to DELETE draft ID: " + id + "?")) return;
        $http.post(SERVER + 'draft/rm/' + id)
            .success((data, status, headers, config) => {
                alert("Draft Removed!")
                $http.get(SERVER + 'draft/all').then(function (res) {
                    $scope.allDraft = res.data.data;
                });
            })
            .error(errCallback);
    };

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };
});


app.controller("usermgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {

    $scope.allUser = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllUser(function (response) {
        $scope.allUser = response.data.data;
    }, errCallback);

    // user mgt part
    $scope.saveUser = function (data, id) {
        let body = {
            username: data.username,
            phone: data.phone,
            email: data.email
        }

        if (!id) {
            $http.post(SERVER + 'user/add', body)
                .success((data, status, headers, config) => {
                    DataService.getAllUser(function (response) {
                        alert("user added!");
                        $scope.allUser = response.data.data;
                    }, errCallback);
                })
                .error(errCallback);;
        } else {
            $http.post(SERVER + 'user/edit/' + id, body)
                .success((data, status, headers, config) => {
                    alert("user updated!");
                })
                .error(errCallback);;
        }
    };

    // remove user
    $scope.removeUser = function (id) {
        if (confirm("Do you want to remove user ID: " + id)) {
            $http.post(SERVER + 'user/rm/' + id)
                .success((data, status, headers, config) => {
                    $route.reload();
                })
                .error(errCallback);;
        }
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

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };

    $scope.checkEmail = function (data) {
        if (data.length != 0 && !data.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)) {
            return "invalid!";
        }
    }

    $scope.checkPhone = function (data) {
        data = String(data);
        if (data.length != 0 && !data.match(/^[0-9]{1,45}$/)) {
            return "invalid!";
        }
    }
});

app.controller("finalmgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {

    $scope.allFinal = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllFinal(function (response) {
        $scope.allFinal = response.data.data;
    }, errCallback);

    // final mgt part
    $scope.open = function (id) {
        $window.open('#/proposalDetail/' + id, '_blank');
    }

    $scope.removeFinal = function (id) {
        if (!confirm("Do you want to DELETE proposal ID: " + id + "?")) return;
        $http.post(SERVER + 'final/rm/' + id)
            .success((data, status, headers, config) => {
                DataService.getAllFinal(function (response) {
                    alert("Proposal Deleted!")
                    $scope.allFinal = response.data.data;
                })
            })
            .error(errCallback);
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
});

app.controller("phasemgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {

    $scope.allFinal = [];
    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllFinal(function (response) {
        $scope.allFinal = response.data.data;
    }, errCallback);


    $scope.originPhase = 0;
    $scope.phase = 0;

    DataService.getPhase(function (response) {
        let phase = response.data.data[0];
        $scope.originPhase = Number(phase.current_phase);
        $scope.phase = Number(phase.current_phase);
        $scope.endDates = [{
            phase1_end: phase.phase1_end.split('T')[0],
            phase2_end: phase.phase2_end.split('T')[0],
            phase3_end: phase.phase3_end.split('T')[0],
        }];
    }, errCallback);

    $scope.gradePs = [];
    DataService.getGradeProposals(function (res, status, headers, config) {
        $scope.gradePs = (function () {
            let ps = "";
            for (let a of res.data.data) {
                ps += a.proposal_id + " ";
            }
            return ps;
        }());
    }, errCallback);

    $scope.votePs = [];
    DataService.getVoteProposals(function (res, status, headers, config) {
        $scope.votePs = (function () {
            let ps = "";
            for (let a of res.data.data) {
                ps += a.proposal_id + " ";
            }
            return ps;
        }());
    }, errCallback);

    $scope.displayPs = [];
    DataService.getDisplayProposals(function (res, status, headers, config) {
        $scope.displayPs = (function () {
            let ps = "";
            for (let a of res.data.data) {
                ps += a.proposal_id + " ";
            }
            return ps;
        }());
    }, errCallback);

    let submitProposalForm = function (valid, ps, url) {
        if (valid) {

            if (new Set(ps).size !== ps.length) {
                alert("Contains Duplicate Proposals!");
                return;
            }

            for (let p of ps) {
                let f = false;
                for (let pro of $scope.allFinal) {
                    if (pro.proposal_id == p) {
                        f = true;
                    }
                }
                if (!f) {
                    alert("Wrong proposal id!");
                    return;
                }
            }

            let body = {
                ps: ps
            };
            $http.post(SERVER + url, body)
                .success(function (data, status, headers, config) {
                    alert("Proposals Updated!");
                })
                .error(errCallback);
        }
    }

    $scope.submitGradeProposalForm = function (valid) {
        submitProposalForm(valid, $scope.gradePs.trim().split(/\s+/g), 'stage/grade/p');
    }

    $scope.submitVoteProposalForm = function (valid) {
        submitProposalForm(valid, $scope.votePs.trim().split(/\s+/g), 'stage/vote/p');
    }

    $scope.submitDisplayProposalForm = function (valid) {
        submitProposalForm(valid, $scope.displayPs.trim().split(/\s+/g), 'stage/display/p');
    }

    $scope.changePhase = function () {
        $http.post(SERVER + 'phase/editCurrentPhase/' + $scope.originPhase + '&' + $scope.phase)
            .success((data, status, headers, config) => {
                $scope.originPhase = $scope.phase;
                alert("Phase changed!");
            })
            .error(errCallback);
    }

    $scope.saveDate = function (data) {
        $http.post(SERVER + 'phase/editEndDates/' + $scope.originPhase, data)
            .success((data, status, headers, config) => {
                alert("Phase end dates changed!");
            })
            .error(errCallback);
    }
    $scope.checkDate = function (data) {
        if (!data.match(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)) {
            return "invalid!";
        }
    }

    $scope.openballot = function () {
        $window.open('#ballot');
    };
});