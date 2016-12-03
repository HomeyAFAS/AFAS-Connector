const request = require('request');

exports.get_connector = function(connector, filter, callback){
	var token = Homey.manager('settings').get( 'token' );
	var url = 'https://32772.afasonlineconnector.nl/profitrestservices/' + connector;
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