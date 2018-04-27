app.controller("proposalDetailController", function ($scope, $http, $routeParams, $route, DataService) {
    $scope.pid = $routeParams.pid;
    $scope.proposal = DataService.getProposal($scope.pid, function (response) {
        $scope.proposal = response.data.data[0];
    });

    $scope.editable = false;

    $scope.edit = function () {
        $scope.editable = true;
    }

    $scope.submitForm = function (valid) {
        var body = $scope.proposal;
        if (valid) {
            $http.post(SERVER + 'final/edit/' + $scope.proposal.proposal_id
                , body)
                .success((data, status, headers, config) => {
                    $route.reload();
                })
                .error(function (data, status, header, config) {
                    alert(JSON.stringify(data));
                });
        }

    }

})