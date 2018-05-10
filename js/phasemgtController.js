app.controller("phasemgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService, role) {
    if (role != "admin") $location.path("#home");
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
        $scope.originPhase = (phase) ? Number(phase.current_phase) : 0;
        $scope.phase = (phase) ? Number(phase.current_phase) : 0;
        if ($scope.phase != 0) {
            $scope.endDates = [{
                phase1_end: phase.phase1_end.split('T')[0],
                phase2_end: phase.phase2_end.split('T')[0],
                phase3_end: phase.phase3_end.split('T')[0],
            }];
        } else {
            $scope.endDates = [{
                phase1_end: "",
                phase2_end: "",
                phase3_end: "",
            }];
        }

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
                $window.location.reload();
            })
            .error(errCallback);
    }

    $scope.saveDate = function (data) {
        $http.post(SERVER + 'phase/editEndDates/' + $scope.originPhase, data)
            .success((data, status, headers, config) => {
                alert("Phase end dates changed!");
                $window.location.reload();
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