app.controller("mapController", function ($scope, $http, $route, $rootScope, $timeout, phaseAndProposal) {
    $scope.phase = phaseAndProposal.phase;

    $scope.proposals = phaseAndProposal.proposals;

    initMap();

    $scope.keyword = "";

    $scope.timeout = function () {
        $timeout(function () {
            $scope.search();
        }, 500);
    }

    $scope.search = function () {
        if ($scope.keyword != "") {
            $scope.proposals = phaseAndProposal.proposals.filter(pro => JSON.stringify(pro).toLowerCase().includes($scope.keyword.toLowerCase()));
        } else {
            $scope.proposals = phaseAndProposal.proposals;
        }
    }

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
        latitude: 0,
        longitude: 0
    };

    $scope.submitForm = function (isValid) {
        if (isValid) {
            let body = {
                draft_id: (new Date()).toISOString(),
                proposal_title: $scope.newProposal.title,
                proposal_idea: $scope.newProposal.idea,
                proposal_latitude: document.getElementById("newProposalLa").value,
                proposal_longitude: document.getElementById("newProposalLo").value,
                project_location: document.getElementById("location").value
            }
            if (body.project_location.length == 0) {
                alert('Please specify a location!');
                return;
            }

            $http.post(SERVER + 'draft/add', body)
                .success(function (data, status, headers, config) {
                    alert("Proposal Submitted!");
                    $route.reload();
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