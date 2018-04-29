app.controller("profileController", function ($scope, $route, $location, $rootScope, $routeParams, $http, DataService) {
    // if auth expires, jump back to home
    if (!$rootScope.userId) {
        $location.path("#home");
    }

    $scope.profile = {};
    $scope.uid = $routeParams.uid;

    $scope.profile = DataService.getUser($scope.uid, function (response) {
        $scope.profile = response.data.data[0];
    });

    $scope.editable = false;

    $scope.edit = function () {
        $scope.editable = true;
    }

    $scope.submitForm = function (valid) {
        let body = {
            username: $scope.profile.account_name,
            phone: $scope.profile.user_phone_number,
            email: $scope.profile.user_email,
        };
        //console.log(body);
        if (valid) {
            $http.post(SERVER + 'user/edit/' + $scope.uid
                , body)
                .success((data, status, headers, config) => {
                    alert("Profile Updated!")
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(JSON.stringify(data));
                });
        }
    }
});