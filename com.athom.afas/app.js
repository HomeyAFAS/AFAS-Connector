"use strict";
const api = Homey.manager('api')
const connector = require('./lib/connector.js');
const betterLogic = new api.App('net.i-dev.betterlogic')

function init() {
	Homey.manager('flow').on('action.get_connector', function( callback, args ){
		betterLogic.isInstalled(function (err, installed) {
			if (err) {
				Homey.log(err);
				return callback('There is something wrong with BetterLogic', null);
			}
			if (installed !== true) return callback('BetterLogic is not installed', null)
		})

		connector.get_connector( args, function( err, response ){
			if (err) {
				Homey.log(err)
			} else {
				betterLogic.put('/patrick/' + response['title'], null, function (err, result) {
					if (err) Homey.log(err);
					Homey.log(response);
					callback(null, true)
				});
			}
		});
	});
}

module.exports.init = init;