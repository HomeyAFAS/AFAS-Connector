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

		Homey.manager('flow').on('action.zonwering', function( callback, args ){
			const stop = Buffer.from("0f0003010001bcfff04965e1008081", "hex");
			const down = Buffer.from("0f0003010000bcfff04865e1008101", "hex");
			const up   = Buffer.from("0f0003010004bcfff04865e1008080", "hex");

			switch(args.type) {
				case "up":
					var message = up;
					break;
				case "down":
					var message = down;
					break;
				case "stop":
					var message = stop;
					break;
			}
			// NOTE: the port is different
			var host = "192.168.2.14", port = 1634;

			var dgram = require( "dgram" );

			var client = dgram.createSocket( "udp4" );

			client.send(message, 0, message.length, port, host );
			return callback(null, true);
		});
	}
};

String.prototype.replaceTags = function(response) {
	var target = this;
	var myRegexp = /\[\[(\w+)\]\]/g;
	var match = myRegexp.exec(target);
	while (match != null) {
	  target = target.replace(match[0], response[match[1]]);
	  match = myRegexp.exec(target);
	}
	return target;
};