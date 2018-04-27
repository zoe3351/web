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