app.controller("profileController", function ($scope, $route, $location, $rootScope, $routeParams, $window, $http, DataService) {
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
        let dis = (response.data.data[0]) ? response.data.data[0].district_phase3 : 0;
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
            first_name: $scope.profile.first_name,
            last_name: $scope.profile.last_name,
        };
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
        if(!confirm("The district preference CANNOT be changed once set, set district?")){
            return;
        }
        let url = SERVER + 'user/district/';
        if ($scope.originDistrict === 0) {
            url += 'add/'
        } else {
            url += 'edit/'
        }

        $http.post(url + $scope.uid + '&' + $scope.district1)
            .success((data, status, headers, config) => {
                $scope.originDistrict = $scope.district1;
                alert("District Updated!")
                $window.location.reload();
            })
            .error(function (data, status, header, config) {
                alert(JSON.stringify(data));
            });
    }
});