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