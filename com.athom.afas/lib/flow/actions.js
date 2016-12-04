"use strict";

const api = Homey.manager('api')
const connector = require('./connector.js');
const betterLogic = new api.App('net.i-dev.betterlogic')

module.exports = {
	createActions: function () {
		Homey.manager('flow').on('action.get_connector_better_logic', function( callback, args ){
			betterLogic.isInstalled(function ( err, installed ) {
				if (err) Homey.log(err); return callback('There is something wrong with BetterLogic', false);
				if (installed !== true) Homey.log(err); return callback('BetterLogic is not installed', false);
			})

			connector.getConnector( args.get_connector + "connectors/", "skip=0&take=1&" + args.filter, function( err, response ){
				if (err) Homey.log(err); return callback('There is something wrong with the connector', false);

				var result = response[0];
				betterLogic.put('/patrick/' + result['title'], null, function ( err, result ) {
					if (err) Homey.log(err); return callback('There is something wrong with BetterLogic', false);
					return callback(null, true);
				});
			});
		});
	}
};