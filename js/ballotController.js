app.controller("ballotController", function ($scope, $http, $routeParams, $location, $route, DataService, role) {
    if (role != "admin") $location.path("#home");

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
            username: (new Date()).toISOString(),
            phone: 0,
            email: "admin@admin.com",
            first_name: $scope.ballot.firstname,
            last_name: $scope.ballot.lastname
        };

        $http.post(SERVER + 'user/add', newUser)
            .success((data, status, headers, config) => {
                let uid = data.data[0].user_system_id;
                callback(uid, body);
            })
            .error(function (data, status, header, config) {
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