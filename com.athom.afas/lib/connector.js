"use strict";

const request = require('request');

module.exports = {
	getConnector: function(connector, filter, callback){
		var token = Homey.manager('settings').get( 'token' );
		var omgevingsNaam = Homey.manager('settings').get( 'omgevingsnaam' );

		if ( !token || !omgevingsnaam ) return callback('Omgevingsnaam of token niet gezet in instellingen', null);

		var url = 'https://' + omgevingsNaam + '.afasonlineconnector.nl/profitrestservices/' + connector;
		request({
			headers: {
				'authorization': 'AfasToken ' + new Buffer(token).toString('base64')
			},
			uri: url + '?' + filter,
			timeout: 1500
		}, function(err, response, body) {
			if (err) {
				Homey.log(err);
				callback(err, body);
			} else {
				if (len(response.rows) > 0){
					var response = JSON.parse(body);
					callback(null, response.rows);
				} else {
					callback("No rows found", null);
				}
			}
		});
	}
}