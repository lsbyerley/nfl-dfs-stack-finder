
var homeCtrl = angular.module('homeCtrl', []);

homeCtrl.controller('homeCtrl', function($scope, $rootScope, PlayerService, toastr, $window) {
	
	$scope.searchPlayers = '';
	$scope.players = [];
	$scope.playerPool = [];
	$scope.filteredPlayers = [];
	$scope.selectedPlayersTeam = 'All';
	$scope.selectedPlayers = [];
	$scope.stackSortType = 'total_proj';
	$scope.stackSortReverse = true;
	$scope.sortType = 'proj';
	$scope.sortReverse = true;
	$scope.teamLabels = [];
	$scope.playerPositions = ['All','Flex'];
	$scope.filteredPosition = 'All';
    $scope.sources = [
		{
			id: 3,
			name: "Fanduel",
			min_salary: 4000,
			step: 100
		},
		{	
			id: 4,
			name: "Draftkings",
			min_salary: 2000,
			step: 100
		},
		{
			id: 11,
			name: "Yahoo",
			min_salary: 10,
			step: 1
		}
	];
	$scope.models = [
		{
			id: 43962,
			name: "Upside"
		},
		{
			id: 43963,
			name: "Consistency"
		}
	];
	$scope.selectedModelId = 43962;
	$scope.selectedSourceId = 3;
	$scope.source = $scope.sources.find(getSourceFromId)
	$scope.slider = {
	    minValue: $scope.source.min_salary,
	    maxValue: $scope.source.min_salary,
	    options: {
	        floor: $scope.source.min_salary,
	        ceil: $scope.source.min_salary,
	        step: $scope.source.step
	    }
	};
	
	function getSourceFromId(source) {
		return source.id === $scope.selectedSourceId;
	}
	
	
	$scope.getPlayers = function() {
		
		//PlayerService.getTestData().then(function(data) {
		PlayerService.getPlayers($scope.selectedModelId).then(function(data) {
			$scope.players = data.PlayerModels
			filterPlayerPool();
		});
		
	};
	
	function filterPlayerPool() {
		
		angular.forEach($scope.players, function(player) {
            if (player.source_id == $scope.selectedSourceId){
            	$scope.playerPool.push(player);
            	if ($scope.slider.maxValue < player.salary) {
            		$scope.slider.maxValue = player.salary;
            		$scope.slider.options.ceil = player.salary;
            	}
            	if ($scope.teamLabels.indexOf(player.team) === -1) {
            		$scope.teamLabels.push(player.team)
            	}
            	if ($scope.playerPositions.indexOf(player.pos) === -1) {
            		$scope.playerPositions.push(player.pos);
            	}
            }
        });
		
	}
	
	$scope.addToStack = function(player) {
		
		if ($scope.selectedPlayers.length == 0) {
			$scope.selectedPlayersTeam = player.team;
			$scope.searchPlayers = '';
			$scope.selectedPlayers.push(player);
		} else {
			if (player.team === $scope.selectedPlayersTeam && $scope.selectedPlayers.indexOf(player) === -1) {
				$scope.selectedPlayers.push(player);		
			} else {
				toastr.error('Wrong team or player already in the selected players list!');
			}
		}
		
	}
	
	// used the Create Stack Button
	$scope.buildCustomStack = function(players) {
		var stack = $scope.calculateStack(players);
		$rootScope.teamStacks.push(stack);
		$scope.selectedPlayers = [];
		$scope.selectedPlayersTeam = 'All';
		updateLocalStorage();
	}
	
	$scope.calculateStack = function(players) {
		
		// add up totals for the team
		var team_name = '';
		var team_opp = '';
		var total_salary = 0;
		var total_proj = 0;
		var total_ceiling = 0;
		var total_floor = 0;
		var point_per = 0;
		angular.forEach(players, function(player) {
			team_name = player.team;
			team_opp = (player.opp.includes('@')) ? player.opp : 'vs. '+player.opp;
            total_salary += player.salary;
            total_proj += player.proj;
            total_ceiling += player.ceiling;
            total_floor += player.floor;
        });
        
        // calculate point per $1000
        var multiplier = ($scope.source.id === 11) ? 10 : 1000
        point_per = ((total_proj*multiplier) / total_salary);
        
        // format the output
        point_per = parseFloat(point_per).toFixed(1);
        total_proj = parseFloat(total_proj).toFixed(1);
        total_ceiling = parseFloat(total_ceiling).toFixed(1);
        total_floor = parseFloat(total_floor).toFixed(1);
		
		var team_stack = {
			name: team_name,
			opp: team_opp,
			total_salary: total_salary,
			total_proj: total_proj,
			total_ceiling: total_ceiling,
			total_floor: total_floor,
			point_per: point_per,
			players: players
		};
		
		return team_stack;
		
	}
	
	$scope.autoGenerateStack = function(type){
		
		// reset selected players and team
		$rootScope.teamStacks = [];
		delete $window.localStorage.teamStacks;
		$scope.selectedPlayers = [];
		$scope.selectedPlayersTeam = 'All';
		
		var team_rosters = [];
		
		// loop through each team label
		angular.forEach($scope.teamLabels, function(team_label) {

			var roster = [];
			
			// add each player from that team to the roster array
			angular.forEach($scope.playerPool, function(player) {
				if (player.team === team_label) {
					if (player.pos === "QB" || player.pos === "RB" || player.pos === "WR" || player.pos === "TE") {
						roster.push(player);	
					}
				}
			});
			
			if (roster.length) {
				// sort them by projected points
				roster.sort(compareProj);
				
				// add to the team rosters array
				team_rosters.push({
					team: team_label,
					roster: roster	
				});
			}
			
		});
		
		// loop through each roster and build a stack out of the two or three highest projected players from the roster
		for (var i=0; i<=team_rosters.length; i++) {
			
			var team = team_rosters[i];
			if (team && team.roster) {
				
				if (type === "2-player") {
					var players = [ team.roster[0], team.roster[1] ];
				} else {
					var players = [ team.roster[0], team.roster[1], team.roster[2] ];
				}
				var stack = $scope.calculateStack(players);
				$rootScope.teamStacks.push(stack);

			}
			
		}
		
		updateLocalStorage();
		
	}
	
	function compareProj(a,b) {
		return b.proj - a.proj;
	}
	
	$scope.removePlayer = function(player){
		var index = $scope.selectedPlayers.indexOf(player);
		$scope.selectedPlayers.splice(index, 1);
		if ($scope.selectedPlayers.length == 0) {
			$scope.selectedPlayersTeam = 'All';
		}
	}
	
	function updateLocalStorage() {
		
		// remove haskey when storing to local storage to prevent ng-repeat duplicates
		$window.localStorage.teamStacks = JSON.stringify($rootScope.teamStacks, function (key, val) {
		     if (key == '$$hashKey') {
		         return undefined;
		     }
		     return val;
		});
		
	}
	
	$scope.updatePositionFilter = function(position) {
		$scope.filteredPosition = position;
	}
	
	$scope.updateStackSort = function(sort,reverse) {
		$scope.stackSortType = sort;
        $scope.stackSortReverse = reverse;	
	}
	
	$scope.removeStack = function(team){
		var index = $rootScope.teamStacks.indexOf(team);
		$rootScope.teamStacks.splice(index, 1);
		updateLocalStorage();
	}
	
	$scope.reset = function() {
		$scope.selectedPlayers = [];
		$scope.selectedPlayersTeam = 'All';
		$scope.searchPlayers = ''
		$rootScope.teamStacks = [];
		$scope.filteredPosition = 'All'
		//$scope.slider.options.ceil = $scope.slider.maxValue;
		//$scope.slider.options.floor = $scope.slider.minValue;
		delete $window.localStorage.teamStacks;
	}
	
	$scope.updateSort = function(sort,reverse) {
        $scope.sortType = sort;
        $scope.sortReverse = reverse;
    }
    
    $scope.updateSource = function(source) {
    	$scope.source = source;
    	$scope.selectedSourceId = source.id;
	    	$scope.slider = {
		    minValue: $scope.source.min_salary,
		    maxValue: $scope.source.min_salary,
		    options: {
		        floor: $scope.source.min_salary,
		        ceil: $scope.source.min_salary,
		        step: $scope.source.step
		    }
		};
    	$scope.playerPool = [];
    	filterPlayerPool();
    }
	
	$scope.getPlayers();

});