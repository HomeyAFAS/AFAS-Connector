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

		connector.get_connector( args.get_connector + "connectors/", "skip=0&take=1&" + args.filter, function( err, response ){
			if (err) {
				Homey.log(err);
			} else {
				var result = response[0];
				betterLogic.put('/patrick/' + result['title'], null, function (err, result) {
					if (err) Homey.log(err);
					callback(null, true);
				});
			}
		});
	});

	Homey.manager('flow').on('action.get_connector.arg_name.get_connector', function( callback, args ){
		connector.get_connector( "metainfo", "", function( err, response){
			if (err) {
				Homey.log(err);
			} else {
				var getConnectors = response['getConnectors'];

				// filter items to match the search query
				getConnectors = getConnectors.filter(function(item){
					return ( item.id.toLowerCase().indexOf( args.query.toLowerCase() ) > -1 )
				});

				callback( null, getConnectors ); // err, results
			}
		});

	});
}

module.exports.init = init;