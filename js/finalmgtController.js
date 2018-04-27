app.controller("finalmgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {

    $scope.allFinal = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllFinal(function (response) {
        $scope.allFinal = response.data.data;
    }, errCallback);

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