var request = require('supertest'),
	should = require('chai').should(),
	api = request((process.env.APP_BASEURL || 'http://localhost:3001')  + '/api');

describe('API', function() {

	describe('GET /servernames', function() {
		it('should return 200', function(done) {
			api.get('/servernames').expect(200, done);
		});

		it('should return a random server name', function(done) {
			api.get('/servernames').end(function(err, req) {
				req.body.should.exist;
				done();
			});
		});
	});

});
