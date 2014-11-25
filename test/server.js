var express = require('express');
var app = express();

app.use(express.static(__dirname + '/../'));

app.get('/redmine/projects.json', function(req, res){
	var key = req.param('key');
	var limit = req.param('limit');
	var offset = req.param('offset');
	
	var object = {
		projects: [{
			id: 1,
			name: "Parent-Test",
			identifier: "parenttest",
			description: "No-Description",
			status: 1,
			created_on: "2013-06-04T08:02:19Z",
			updated_on: "2014-07-02T09:20:19Z"
		}, {
			id: 2,
			name: "Testprojekt",
			identifier: "testprojekt",
			description: "Das ist ein Testprojekt. Hier kann eine Description erfasst werden",
			parent: {
				id: 1,
				name: "CMS"
			},
			status: 1,
			created_on: "2013-08-16T12:24:37Z",
			updated_on: "2013-08-16T12:24:37Z"
		}],
		total_count: 2,
		offset: offset || 0,
		limit: limit || 10
	};

	res.send(object);
});

app.listen(3000);