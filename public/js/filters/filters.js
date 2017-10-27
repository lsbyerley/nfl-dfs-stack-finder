angular.module('DFSOptimizer.filters', [])

.filter('TeamFilter', function() {
	return function(playerPool, selectedPlayersTeam) {
		var filtered = [];
		if (selectedPlayersTeam === 'All') {
			return playerPool
		} else {
			angular.forEach(playerPool, function(player) {
				if (player.team === selectedPlayersTeam) {
					filtered.push(player);
				}
			});
			return filtered;
		}
	}
})

.filter('PositionFilter', function() {
	return function(playerPool, filteredPosition) {
		var filtered = [];
		if (filteredPosition === 'All') {
			return playerPool;
		} else if (filteredPosition === 'Flex') {
			angular.forEach(playerPool, function(player) {
				if (player.pos === 'WR' || player.pos === 'RB' || player.pos === 'TE') {
					filtered.push(player);
				}
			});
			return filtered;
		} else {
			angular.forEach(playerPool, function(player) {
				if (player.pos === filteredPosition) {
					filtered.push(player);
				}
			});
			return filtered;
		}
	}
})

.filter('SalaryFilter', function() {
    return function(playerPool, slider) {
        var filtered = [];
        angular.forEach(playerPool, function(player) {
			if (player.salary >= slider.minValue && player.salary <= slider.maxValue) {
				filtered.push(player);
			}
		});
		return filtered;
    }
})