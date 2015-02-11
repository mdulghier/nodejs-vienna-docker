var path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	randomPicker = require('./randomPicker'),
	redis = require('redis');

var client = redis.createClient(process.env.REDIS__PORT || 6379, process.env.REDIS__HOST || 'localhost', {});

var app = express();
app.use(favicon(path.join(__dirname, 'client/favicon.ico')));
app.use(bodyParser.json({limit: '1mb'}));
app.use(express.static(path.join(__dirname, 'client')));

app.get('/api/servernames', function(req, res, next) {
	console.log('GET ' + req.url);
	client.incr('stats:names_generated');
	var style = req.query.style || 'mnemonic';
	var generators = [ 'mnemonic', 'docker', 'gameofthrones', 'philosophers' ];
	if (style === 'random') style = randomPicker(generators);
	else if (generators.indexOf(style) < 0) style = 'mnemonic';
	var generator = require('./generators/' + style);
	var servername = generator();
	return res.send(servername);
});

app.get('/api/stats', function(req, res, next) {
	console.log('GET ' + req.url);
	client.get('stats:names_generated', function(err, val) {
		return res.json({ names_generated: val });
	});
});

app.get('/', function(req, res, next) {
	console.log('GET ' + req.url);
	return res.file(path.join(__dirname, 'client/index.html'));
});

module.exports = app;

