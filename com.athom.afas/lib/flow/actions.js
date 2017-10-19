"use strict";

const api = Homey.manager('api')
const connector = require('../connector.js');
const betterLogic = new api.App('net.i-dev.betterlogic')
const soundboard = new api.App('com.athom.soundboard')

module.exports = {
	createActions: function () {
		Homey.manager('flow').on('action.get_connector_better_logic', function( callback, args ){
			betterLogic.isInstalled(function ( err, installed ) {
				if (err) return callback('There is something wrong with BetterLogic', false);
				if (installed !== true) return callback('BetterLogic is not installed', false);
			})

			connector.getConnector( "connectors/" + args.get_connector.name, "skip=0&take=1&" + args.filter, function( err, response ){
				if (err) return callback('There is something wrong with the connector', false);

				if (response.rows.length > 0) {
					var result = response.rows[0];
					betterLogic.put('/' + args.variable_name + '/' + result['title'], null, function ( err, result ) {
						if (err) return callback('There is something wrong with BetterLogic', false);
						return callback(null, true);
					});
				} else {
					return callback("No rows found", false);
				}
			});
		});

		Homey.manager('flow').on('action.get_connector_speech', function( callback, args ){
			Homey.log(args);
			connector.getConnector( "connectors/" + args.get_connector.name, "skip=0&take=1&" + args.filter, function( err, response ){
				if (err) return callback('There is something wrong with the connector', false);

				if (response.rows.length > 0) {
					var result = response.rows[0];
					var speech = args.speech;
					speech = speech.replaceTags(result);

					var pastResultId = Homey.manager('settings').get( 'connector_' + args.get_connector.name );
					var currentResultId = result[Object.keys(result)[0]]
					if (currentResultId != pastResultId) {
						Homey.manager('settings').set( 'connector_' + args.get_connector.name, currentResultId );
						Homey.manager('settings').set( 'connector_json_' + args.get_connector.name, JSON.stringify(result) );
						
						soundboard.post("/"+args.sound.id+"/play", function(err, args) {
							if (err) return callback('There is something wrong with soundboard', false);
						});
						setTimeout(function(){ 
							Homey.manager('speech-output').say( speech, function(err, succes){
								if (err) return callback('There is something wrong with speech', false);
							});
							return callback(null, true);
						}, 2000);
					}
				} else {
					return callback("No rows found", false);
				}
			});
		});
	}
};

String.prototype.replaceTags = function(response) {
	var target = this;
	var myRegexp = /\[\;(\w+)\;\]/g;
	var match = myRegexp.exec(target);
	while (match != null) {
	  target = target.replace(match[0], response[match[1]]);
	  match = myRegexp.exec(target);
	}
	return target;
};
