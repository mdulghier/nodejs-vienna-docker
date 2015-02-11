var should = require('chai').should(),
	wd = require('wd');

describe('App', function() {

	var browser,
		seleniumOptions = {
			hostname: process.env.SELENIUM_HOST || 'localhost',
			port: process.env.SELENIUM_PORT || '9515',
			path: process.env.SELENIUM_PATH || '/'
		};

	before(function() {
		browser = wd.promiseChainRemote(seleniumOptions);	
		return browser.init({ browserName: process.env.SELENIUM_BROWSER || 'chrome'});
	});

	after(function() {
		return browser.quit();
	});

	describe('Landing page', function(done) {
		it('should show server name after generate name button was clicked', function(done) {
			return browser.get(process.env.APP_BASEURL || 'http://localhost:8080')
				.elementById('generate-name').click()
				.elementById('generated-name').text().should.eventually.not.equal('').notify(done);
		});
	});
});
