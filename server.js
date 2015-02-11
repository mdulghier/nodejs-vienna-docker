var app = require('./app');

var server = app.listen(process.env.PORT || 8080, function() {
	console.log('servernames.ninja listening at http://%s:%s', server.address().adress, server.address().port);
});

process.on('SIGTERM', function() {
	console.log('shutting down...');
	server.close();
});
