"use strict";

module.exports = [

	{
		method		: 'GET',
		path		: '/:id',
		fn			: function( callback, args ) {
			var json = Homey.manager('settings').get( 'connector_json_' + args.params.id );
			if (json !== undefined && json.length){
				json = JSON.parse(json);
				callback( null, json );
			} else {
				callback( 'Invalid connector name' );
			}
		}
	}

]