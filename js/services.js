var services = angular.module('services', []);

services.service('variables', ['localStorageService', '$location', function(localStorageService, $location) {
  return {
    apiKey: function(key) {
      if (key) {
        localStorageService.setApiKey(key);
      }
      return localStorageService.getApiKey() || null;
    },
    baseUrl: function(baseUrl)  {
      if (baseUrl) {
        localStorageService.setBaseUrl(baseUrl);
      }

      return localStorageService.getBaseUrl() || null;
    }
  };
}]);

services.service('localStorageService', function() {
  return {
    getTimeEntry: function() {
      return JSON.parse(localStorage.getItem('timeentry'));
    },

    setTimeEntry: function(timeentry) {
      localStorage.setItem('timeentry', JSON.stringify(timeentry));
    },

    hasTimeEntry: function() {
      return localStorage.getItem('timeentry') != undefined;
    },

    removeTimeEntry: function() {
      localStorage.removeItem('timeentry');
    },

    getApiKey: function() {
      return localStorage.getItem('apiKey');
    },
    setApiKey: function(apiKey) {
      localStorage.setItem('apiKey', apiKey);
    },

    getBaseUrl: function() {
      return localStorage.getItem('baseUrl');
    },
    setBaseUrl: function(baseUrl) {
      localStorage.setItem('baseUrl', baseUrl);
    }
  }
});


services.service('redmineService', ['$http', '$q', 'variables', function($http, $q, variables) {
  return {
    getAllUnpage: function(queryMethod, objectname, args) {
        var deferred = $q.defer();
        var limit = 100;

        var queryArguments = [];
        queryArguments.push(0);
        queryArguments.push(limit);

        if (args) {
          for (var i = 0; i < args.length; i++) {
            queryArguments.push(args[i]);
          }
        }

        queryMethod.apply(this, queryArguments).success(function(data) {
            var entities = data[objectname];
            var total = data.total_count;
            if  (entities.length < total) {
                var repeats = Math.ceil((total - entities.length) / limit);
                var promises = [];
                for (var i = 0; i < repeats; i++) {
                    queryArguments[0] = (i+1)*limit;
                    promises.push(queryMethod.apply(this, queryArguments));
                }

                $q.all(promises).then(function(result) {
                    for (var i = 0; i < result.length; i++) {
                        var response = result[i].data;
                        entities = _.union(entities, response[objectname]);
                    }

                    deferred.resolve(entities);
                });
            } else {
                deferred.resolve(entities);
            }
        });
        return deferred.promise;
    },

    getProjects: function() {
      return this.getAllUnpage(this.getProjectsPaged, 'projects');
    },

    getProjectsPaged: function(offset, limit) {
      return $http.get(variables.baseUrl() + '/projects.json', 
        {
          params: {
            offset: offset,
            limit: limit,
            key: variables.apiKey()
          }
        }
      );
    },

    getProject: function(projectId) {
      return $http.get(variables.baseUrl() + '/projects/' + projectId + '.json',
        {
          params: {
            key: variables.apiKey(),
            include: 'trackers,issue_categories'
          }
        }
      );
    },

    getIssue: function(issueId) {
      return $http.get(variables.baseUrl() + '/issues/' + issueId + '.json', 
        {
          params: {
            key: variables.apiKey(),
            include: 'children,attachments,relations,changesets,journals,watchers'
          }
        }
      )
    },

    getIssuesByProject: function(projectId, status) {
      return this.getAllUnpage(this.getIssuesByProjectPaged, 'issues', [projectId, status]);
    },

    getIssuesByProjectPaged: function(offset, limit, projectId, status) {
      return $http.get(variables.baseUrl() + '/issues.json', 
        {
          params: {
            offset: offset,
            limit: limit,
            project_id: projectId,
            key: variables.apiKey(),
            status_id: status
          }
        }
      );
    },

    getActivites: function() {
      return $http.get(variables.baseUrl() + '/enumerations/time_entry_activities.json',
        {
          params: {
            key: variables.apiKey()
          }
        }
      )
    },

    saveTimeEntry: function(timeentry) {
      return $http.post(variables.baseUrl() + '/time_entries.json', {time_entry: timeentry, key: variables.apiKey()});
    }

  };
}]);