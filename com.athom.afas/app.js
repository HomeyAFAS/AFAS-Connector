"use strict";
const request = require('request');
function init() {
	Homey.manager('flow').on('action.get_connector', function( callback, args ){
		var token = Homey.manager('settings').get( 'token' );
		var url = 'https://32772.afasonlineconnector.nl/profitrestservices/connectors/Pocket_Subjects';
		
		request({
			headers: {
				'authorization': 'AfasToken ' + new Buffer(token).toString('base64') 
			},
			uri: url + '?skip=0&take=1&filterfieldids=subjecttype&filtervalues=41&operatortypes=1'
		}, function(error, response, body) {
			if (error) {
				Homey.log('error getting poa');
				return [];
			} else {
				var response = JSON.parse(body);
				Homey.log(response);
			}
		});
	    callback( null, true ); // we've fired successfully
	});
}

module.exports.init = init;