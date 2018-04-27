app.controller("draftmgtController", function ($scope, $filter, $http, $location, $route, $window, $rootScope, DataService) {
    $scope.allDraft = [];

    let errCallback = function (data, status, header, config) {
        alert(JSON.stringify(data));
    }

    DataService.getAllDraft(function (response) {
        $scope.allDraft = response.data.data;
    }, errCallback);

    // draft mgt part
    $scope.saveDraft = function (data, id) {
        let body = {
            draft_id: id,
            proposal_title: data.proposal_title,
            proposal_idea: data.proposal_idea,
            project_location: data.project_location,
            proposal_latitude: data.proposal_latitude,
            proposal_longitude: data.proposal_longitude
        }

        $http.post(SERVER + 'draft/edit/' + id, body)
            .success((data, status, headers, config) => {
                alert("Draft updated!")
            })
            .error(errCallback);
    };

    $scope.removeDraft = function (id) {
        if (!confirm("Do you want to DELETE draft ID: " + id + "?")) return;
        $http.post(SERVER + 'draft/rm/' + id)
            .success((data, status, headers, config) => {
                alert("Draft Removed!")
                $http.get(SERVER + 'draft/all').then(function (res) {
                    $scope.allDraft = res.data.data;
                });
            })
            .error(errCallback);
    };

    $scope.check = function (data) {
        if (!data) {
            return "invalid!";
        }
    };
});