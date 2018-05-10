app.controller("usermgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, $timeout, DataService) {

    $scope.ori = [];
    $scope.allUser = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllUser(function (response) {
        $scope.allUser = response.data.data;
        $scope.ori = response.data.data;
        DataService.getDistrict(function (response) {
            $scope.allDistrict = response.data.data;
            userDistrictJoin();
        }, errCallback);
    }, errCallback);

    function userDistrictJoin() {
        for (let user of $scope.allUser) {
            for (let district of $scope.allDistrict) {
                if (user.user_system_id == district.user_system_id) {
                    user.district = district.district_phase3;
                }
            }
        }
    }

    $scope.timeout = function () {
        $timeout(function () {
            $scope.search();
        }, 500);
    }

    $scope.search = function () {
        if ($scope.keyword != "") {
            $scope.allUser = $scope.ori.filter(user => JSON.stringify(user).toLowerCase().includes($scope.keyword.toLowerCase()));
        } else {
            $scope.allUser = $scope.ori;
        }
    }

    // user mgt part
    $scope.saveUser = function (data, id) {
        let body = {
            username: data.username,
            phone: data.phone || 0,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            district: data.district
        }

        let originDistrict = $scope.allDistrict.filter(dis => dis.user_system_id === id)[0];

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
                    alert("User updated!");
                })
                .error(errCallback);

            if (originDistrict) {
                // if the user has selected district
                $http.post(SERVER + 'user/district/edit/' + id + '&' + body.district, body)
                    .success((data, status, headers, config) => {
                        alert("User district updated!");
                        $window.location.reload();
                    })
                    .error(errCallback);
            } else {
                // if the user haven't selected district yet
                $http.post(SERVER + 'user/district/add/' + id + '&' + body.district, body)
                    .success((data, status, headers, config) => {
                        alert("User district set!");
                    })
                    .error(errCallback);
            }

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
            user_email: "",
            user_phone_number: 0,
            first_name: "",
            last_name: ""
        };
        $scope.allUser.push($scope.inserted);
    };

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };

    $scope.checkDistrict = function (data) {
        data = Number(data);
        if (data && (data <= 0 || data >= 8)) {
            return "invalid!";
        }
    };

    $scope.checkEmail = function (data) {
        if (!data || !data.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/)) {
            return "invalid!";
        }
    }

    $scope.checkPhone = function (data) {
        data = String(data);
        if (!data && !data.match(/^[0-9]{1,45}$/)) {
            return "invalid!";
        }
    }
});