var wd = require('wd'),
	chai = require('chai'),
	chaiAsPromised = require('chai-as-promised');

chaiAsPromised.transferPromiseness = wd.transferPromiseness;
chai.use(chaiAsPromised);


// No environment setup, because this is done out-of-process with containers
