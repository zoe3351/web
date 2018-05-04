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

    $scope.district1 = 0;
    $scope.originDistrict = 0;

    DataService.getUserDistrict($scope.uid, function (response) {
        let dis = (response.data.data[0]) ? response.data.data[0].district_phase3 : -1;
        $scope.originDistrict = Number(dis);
        $scope.district1 = Number(dis);
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

    $scope.changeDistrict = function () {
        let url = SERVER + 'user/district/';
        if ($scope.originDistrict == -1) {
            url += 'add/'
        } else {
            url += 'edit/'
        }

        $http.post(url + $scope.uid + '&' + $scope.district1)
            .success((data, status, headers, config) => {
                $scope.originDistrict = $scope.district1;
                alert("District Updated!")
                $route.reload();
            })
            .error(function (data, status, header, config) {
                alert(JSON.stringify(data));
            });
    }
});