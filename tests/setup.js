var app = require('../app'),
	wd = require('wd'),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised');

chaiAsPromised.transferPromiseness = wd.transferPromiseness;
chai.use(chaiAsPromised);

var server;

before(function(done) {
	server = app.listen(3001, function() {
		console.log('servernames.ninja listening at http://%s:%s', server.address().address, server.address().port);

		// Things you would typically do here:
		// Start DB-Engine
		// Reset/Seed DB
		// ...

		done();
	});
});

after(function(done) {
	server.close(done);
});
