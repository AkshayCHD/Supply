/**
 * Copyright 2017 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
'use strict';
var util = require('util');
var helper = require('./helper.js');
var logger = helper.getLogger('insurance-co-events');
// var Fabric_Client = require('fabric-client');
//var _ = require('underscore');


// const request1 = require('request');

var channelName = 'mychannel';
var username = 'Jim';
var org_name = 'Org1';
// var peers = ["peer0.org1.example.com", "peer0.org2.example.com"];
// var chaincodeName = 'mycc';

// var fcn;
// var args = [];

var temp_critical = false;

var listenEvent = async function () {
	
	var client = await helper.getClientForOrg(org_name, username);
	if (client != null || client != undefined) {
		logger.debug('Successfully got the fabric client for the organization "%s"', org_name);
		var channel = client.getChannel(channelName);
		if (!channel) {
			let message = util.format('Channel %s was not defined in the connection profile', channelName);
			logger.error(message);
			throw new Error(message);
		}

	}	
	
	var event_hub = channel.getChannelEventHubsForOrg()[0];
	event_hub.connect(true);
	

	event_hub.registerChaincodeEvent("mycc","notificationBreach",(event, block_num, txnid, status) => {
		logger.info("Successfully got a chaincode event with transaction id: "+txnid+" with status: "+status);
		logger.info("Successfully received the chaincode event on block number: "+block_num);
		logger.info("chaincode event emitted ",event);

		if (event.payload != undefined || event.payload != null) {
			var message = event.payload.toString();
			console.log("chaincode event result ",message);
			temp_critical = true;
			console.log("**************************###############",temp_critical);
			var parsed_message = JSON.parse(message);
			// console.log("event payload claim id ",parsed_message.claim_id);
			// console.log("event payload comparision results ",parsed_message.comparision_result);
		}

	},
	(error) => {
		logger.info("failed to receive the chaincode event : " + error);
	},
	{
		unregister : false,
		disconnect : false
	});
	

}

function  checkCritical () {
	console.log("********************************##################", temp_critical)
	return temp_critical;
}


	


exports.listenEvent = listenEvent;
exports.temp_critical = temp_critical;
exports.checkCritical = checkCritical;