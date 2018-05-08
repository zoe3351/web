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
            phone: data.phone || 0,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name
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