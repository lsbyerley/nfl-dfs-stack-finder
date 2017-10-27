angular.module('DFSOptimizer.services', [])

.factory('PlayerService', function($http) {

	return {
		getPlayers: function(modelId) {
            return $http.get('/api/playerlist/'+modelId)
                .then(function(response) {
                  return response.data
                });
			
		},
		getTestData: function() {
		    return $http.get('/api/playertestdata')
		        .then(function(response) {
		            return response.data
		        });
		}
	};

})