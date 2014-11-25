var filters = angular.module('filters', []);

filters.filter('hours', function() {
	return function(input) {
		if (input != undefined && input != 0 && input != null) {
			var duration = moment.duration(input, 'hours');

			var hoursDecimal = duration.asHours();
			var hours = Math.floor(hoursDecimal);
			var minutes = Math.floor(duration.asMinutes() - hours*60);

			return hours + ':' + minutes;
		}
		return '';
	};
});