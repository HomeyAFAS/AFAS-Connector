"use strict";

const api = Homey.manager('api')
const connector = require('../connector.js');
const soundboard = new api.App('com.athom.soundboard')

module.exports = {
	createAutocompleteActions: function () {
		Homey.manager('flow').on('action.get_connector_better_logic.get_connector.autocomplete', function( callback, args ){
			connector.getConnector( "metainfo", "", function( err, response ){
				if (err) return callback( 'There is something wrong with the connector', null );

				if (response.getConnectors.length > 0) {
					var getConnectors = renameKey(response['getConnectors'], '"id"', '"name"');
					getConnectors = getConnectors.filter( function( item ) { return ( item.name.toLowerCase().indexOf( args.query.toLowerCase() ) > -1 ) } );
					return callback( null, getConnectors );
				} else {
					return callback( 'No connectors found', null );
				}
			});
		});

		Homey.manager('flow').on('action.get_connector_speech.get_connector.autocomplete', function( callback, args ){
			connector.getConnector( "metainfo", "", function( err, response ){
				Homey.log(err);
				if (err) return callback( 'There is something wrong with the connector', null );
				
				if (response.getConnectors.length > 0) {
					var getConnectors = renameKey(response['getConnectors'], '"id"', '"name"');
					getConnectors = getConnectors.filter( function( item ) { return ( item.name.toLowerCase().indexOf( args.query.toLowerCase() ) > -1 ) } );
					return callback( null, getConnectors );
				} else {
					return callback( 'No connectors found', null );
				}
			});
		});

		Homey.manager('flow').on('action.get_connector_speech.sound.autocomplete', function( callback, args ){
			soundboard.isInstalled(function ( err, installed ) {
				if (err) return callback('There is something wrong with soundboard', false);
				if (installed !== true) return callback('soundboard is not installed', false);
			})

			soundboard.get("/", function(err, sounds){
				if (err) return callback( 'There is something wrong with soundboard', null );

				return callback(null, sounds);
			});
		});
	}
};

function renameKey(object, find, replace) {
	var str = JSON.stringify(object);
	str = str.replaceAll(find, replace);
	return JSON.parse(str);
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};