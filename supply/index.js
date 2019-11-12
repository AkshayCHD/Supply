
var log4js = require('log4js');
var logger = log4js.getLogger('Hospital app');

var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');


var app = express();    

require('./config.js');
var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var cors = require('cors');
app.use(cors());



var events = require('./app/events.js');


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));


// connect with mysql server

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname));


//Start localhost server

var server = http.createServer(app).listen(5000,function() {});
logger.info('****************** SERVER STARTED ************************');
console.log("Server created");
server.timeout = 300000;

events.listenEvent();



app.get('/something', async function(req, res) {
	logger.debug('==================== INVOKE ON CHAINCODE ==================');
	var peers = ["peer0.org1.example.com","peer0.org2.example.com"];
	var chaincodeName = "mycc";
	var channelName = "mychannel";
	var fcn = "addTemperature";
	var temp = parseInt(req.query.temperature).toString();
	var args = ["1", "1", temp];
	logger.debug('channelName  : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn  : ' + fcn);
	logger.debug('args  : ' + args);
	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}

	logger.info(peers);
	logger.info(args);

	let message = await invoke.invokeChaincode(peers, channelName, chaincodeName, fcn, args, "Jim", "Org1");
	res.send(message);
});


// Query on chaincode on target peers
app.get('/nothing', async function(req, res) {
	logger.debug('==================== QUERY BY CHAINCODE ==================');
	var channelName = "mychannel";
	var chaincodeName = "mycc";
	let args = req.query.key;
	let fcn = "queryRecord";
	let peer = "peer0.org1.example.com";

	logger.debug('channelName : ' + channelName);
	logger.debug('chaincodeName : ' + chaincodeName);
	logger.debug('fcn : ' + fcn);
	logger.debug('args : ' + args);

	if (!chaincodeName) {
		res.json(getErrorMessage('\'chaincodeName\''));
		return;
	}
	if (!channelName) {
		res.json(getErrorMessage('\'channelName\''));
		return;
	}
	if (!fcn) {
		res.json(getErrorMessage('\'fcn\''));
		return;
	}
	if (!args) {
		res.json(getErrorMessage('\'args\''));
		return;
	}
	args = args.replace(/'/g, '"');
	args = JSON.parse(args);
	logger.info(peer);
	logger.info(args);

	let message = await query.queryChaincode(peer, channelName, chaincodeName, args, fcn, "Jim", "Org1");
	console.log("*******************************-->>",events.temp_critical,"<--************************");
	console.log("************************************************************************************");
	var result = {
		message: message,
		critical: false
	};
	if (events.checkCritical()) {
		result.critical = true;		
	}

	res.send(result);
});


