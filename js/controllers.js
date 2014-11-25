var controllers = angular.module('controllers', ['services', 'filters']);

controllers.controller('headController', ['$scope', '$location' ,'localStorageService', 'variables', function($scope, $location, localStorageService, variables) {
  $scope.timeentry = localStorageService.getTimeEntry() || {};

  $scope.hasTimeEntry = function() {
    return localStorageService.hasTimeEntry();
  };

  $scope.getHoursFromStartTime = function() {
    $scope.timeentry.hours = _($scope.timeentry.timeSlices).reduce(function(memo, timeSlice) {
      var endTime = timeSlice.endTime || new Date().getTime();
      return memo + (endTime - timeSlice.startTime)/(1000*60*60);
    }, 0);
  }

  $scope.getHoursFromStartTime();
  
  if (variables.apiKey() == null || variables.baseUrl() == null) {
    $location.path('/login');
  }
}]);

controllers.controller('loginController', ['$scope', '$location', 'variables', function($scope, $location, variables) {
  $scope.apiKey = variables.apiKey();
  $scope.baseUrl = variables.baseUrl();

  $scope.login = function() {
    variables.apiKey($scope.apiKey);
    if ($scope.baseUrl.endsWith('/')) {
      $scope.baseUrl = $scope.baseUrl.slice(0, -1)
    }
    variables.baseUrl($scope.baseUrl);
    $location.path('/');
  };
}]);

controllers.controller('projectsController', ['$scope', 'redmineService', function($scope, redmineService) {
  $scope.projects = {};

  $scope.getAllProjects = function() {
    redmineService.getProjects().then(function(data) {
        $scope.projects = data;
      });
  };
  $scope.getAllProjects();
}]);

controllers.controller('projectController', ['$scope', '$routeParams', 'redmineService', function($scope, $routeParams, redmineService) {
  $scope.project = {};

  $scope.getData = function() {
    console.log('Get Details for Project ' + $routeParams.projectId);

    redmineService.getProject($routeParams.projectId).success(function(data) {
        $scope.project = data.project;
      });
  };

  $scope.getData();
}]);

controllers.controller('issuesController', ['$scope', '$routeParams', 'redmineService', 'variables', function($scope, $routeParams, redmineService, variables) {
  $scope.issues = {};

  $scope.getData = function() {
    redmineService.getIssuesByProject($routeParams.projectId, $routeParams.status).then(function(data) {
        $scope.issues = data;
      });
  };

  $scope.getRedmineBaseUrl = function(issue) {
    return variables.baseUrl();
  };

  $scope.getData();
}]);

controllers.controller('issueController', ['$scope', '$routeParams', 'redmineService', function($scope, $routeParams, redmineService) {
  $scope.issue = {};

  $scope.getData = function() {
    redmineService.getIssue($routeParams.issueId).success(function(data) {
      $scope.issue = data.issue;
    });
  };

  $scope.getData();
}]);

controllers.controller('timeentryController', ['$scope', 'redmineService', 'localStorageService', function($scope, redmineService, localStorageService) {
  $scope.setNewTimeEntry = function() {
    $scope.timeentry = {
      project: null,
      issue: null,
      hours: null,
      activity: null,
      comment: null,
      timeSlices: [
        {
          startTime: new Date().getTime(),
          endTime: null
        }
      ]
    };
  };
  $scope.setNewTimeEntry();

  $scope.getIssues = function(project) {
    $scope.issues = [];
    redmineService.getIssuesByProject(project.id, 'open').then(function(data) {
      $scope.issues = data;
    });
  };

  $scope.startTimer = function() {
    localStorageService.setTimeEntry($scope.timeentry);
  };

  $scope.stopTimer = function() {
    var timeentry = $scope.timeentry;
    var entryForSave =
        {
          issue_id: timeentry.issue.id,
          hours: (timeentry.hours != undefined && timeentry.hours != '') ? timeentry.hours : $scope.getHoursFromStartTime(),
          activity_id: timeentry.activity.id,
          comments: timeentry.comment
        };

    redmineService.saveTimeEntry(entryForSave).then(function(data) {
      $scope.reset();
    });
  };

  $scope.save = function() {
    localStorageService.setTimeEntry($scope.timeentry);
  };

  $scope.reset = function() {
    localStorageService.removeTimeEntry();
    $scope.setNewTimeEntry();
  };

  $scope.pause = function() {
    _($scope.timeentry.timeSlices).last().endTime = new Date().getTime();
    $scope.save();
  };

  $scope.resume = function() {
    $scope.timeentry.timeSlices.push({startTime: new Date().getTime(), endTime: null});
    $scope.save();
  };

  $scope.isTimerRunning = function() {
    return localStorageService.hasTimeEntry();
  };

  $scope.showStartTimer = function() {
    return !$scope.isTimerRunning() && $scope.timeentryForm.$valid; 
  }

  $scope.showPauseButton = function() {
    return $scope.isTimerRunning() && _($scope.timeentry.timeSlices).last().endTime == null;
  };

  $scope.showResumeButton = function() {
    return $scope.isTimerRunning() && _($scope.timeentry.timeSlices).last().endTime != null;
  };


  $scope.getHoursFromStartTime = function() {
    return _($scope.timeentry.timeSlices).reduce(function(memo, timeSlice) {
      var endTime = timeSlice.endTime || new Date().getTime();
      return memo + (endTime - timeSlice.startTime)/(1000*60*60);
    }, 0);
  }

  // Get timeentry from localstorage
  if (localStorageService.hasTimeEntry()) {
    $scope.timeentry = localStorageService.getTimeEntry();
    $scope.timeentry.hours = $scope.getHoursFromStartTime();
    $scope.getIssues($scope.timeentry.project);
  }

  // Get Projects
  redmineService.getProjects().then(function(data) {
    $scope.projects = data;
  });

  // GetActivites
  redmineService.getActivites().success(function(data) {
    $scope.activities = data.time_entry_activities;
  });

}]);
