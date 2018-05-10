app.controller("finalmgtController", function ($scope, $filter, $http, $location, $timeout, $route, $window, $rootScope, DataService, role) {
    if (role != "admin") $location.path("#home");

    $scope.ori = [];
    $scope.allFinal = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllFinal(function (response) {
        $scope.ori = response.data.data;
        $scope.allFinal = response.data.data;
    }, errCallback);

    $scope.timeout = function () {
        $timeout(function () {
            $scope.search();
        }, 500);
    }

    $scope.search = function () {
        if ($scope.keyword != "") {
            $scope.allFinal = $scope.ori.filter(pro => JSON.stringify(pro).toLowerCase().includes($scope.keyword.toLowerCase()));
        } else {
            $scope.allFinal = $scope.ori;
        }
    }

    // final mgt part
    $scope.open = function (id) {
        $window.open('#/proposalDetail/' + id, '_blank');
    }

    $scope.removeFinal = function (id) {
        if (!confirm("Do you want to DELETE proposal ID: " + id + "?")) return;
        $http.post(SERVER + 'final/rm/' + id)
            .success((data, status, headers, config) => {
                DataService.getAllFinal(function (response) {
                    alert("Proposal Deleted!")
                    $scope.allFinal = response.data.data;
                })
            })
            .error(errCallback);
    };

    $scope.upload = function () {
        let uploadInput = angular.element(document.getElementById('uploadInput'))[0];

        if (uploadInput.files.length > 0) {
            let uploadInputFile = uploadInput.files[0];
            var reader = new FileReader();

            reader.onload = function (event) {
                console.log(event.target.result);
                //TODO: POST
            }

            reader.readAsArrayBuffer(uploadInputFile);
        }

    }
});