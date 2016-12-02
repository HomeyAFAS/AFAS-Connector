const request = require('request');

exports.get_connector = function(args, callback){
	var token = Homey.manager('settings').get( 'token' );
	var url = 'https://32772.afasonlineconnector.nl/profitrestservices/connectors/' + args.get_connector;
	request({
		headers: {
			'authorization': 'AfasToken ' + new Buffer(token).toString('base64') 
		},
		uri: url + '?skip=0&take=1&' + args.filter,
		timeout: 1500
	}, function(error, response, body) {
		if (error) {
			Homey.log(error)
			callback(error, body);
		} else {
			var response = JSON.parse(body);
			callback(null, response.rows[0]);
		}
	});
}