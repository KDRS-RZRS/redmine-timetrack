module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		develop: {
			server: {
				file: 'server.js'
			}
		},
		protractor_webdriver: {
			options: {
				keepAlive: true
			},
			run: {
			}
		},
		protractor: {
			options: {
				keepAlive: true,
				configFile: 'protractor.conf.js'
			},
			singlerun: {},
			auto: {
				keepAlive: true,
				options: {
					args: {
						seleniumPort: 4444
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-protractor-webdriver');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-develop');

	grunt.registerTask('default', [
		'develop',
		'protractor_webdriver:run',
		'protractor:singlerun'
	]);

};