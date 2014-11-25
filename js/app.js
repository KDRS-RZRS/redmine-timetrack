'use strict';

var app = angular.module('app', ['ngRoute', 'controllers']);
app.config(['$routeProvider', '$compileProvider', function($routeProvider, $compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|chrome-extension):/);

  $routeProvider
    .when('/login', {
      templateUrl: 'fragments/login.html',
      controller: 'loginController'
    })

    .when('/projects', {
      templateUrl: 'fragments/projects.html',
      controller: 'projectsController'
    })
    
    .when('/projects/:projectId', {
      templateUrl: 'fragments/project.html',
      controller: 'projectController'
    })
    
    .when('/projects/:projectId/issues', {
      redirectTo: '/projects/:projectId/issues/status/open'
    })
    
    .when('/projects/:projectId/issues/status/:status', {
      templateUrl: 'fragments/issues.html',
      controller: 'issuesController'
    })
    
    .when('/projects/:projectId/issues/:issueId', {
      templateUrl: 'fragments/issue.html',
      controller: 'issueController'
    })

    .when('/timeentries/new', {
      templateUrl: 'fragments/timeentry.html',
      controller: 'timeentryController'
    })
    
    .otherwise({
      redirectTo: '/timeentries/new'
    });

}]);

