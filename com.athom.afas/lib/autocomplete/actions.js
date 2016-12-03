var connector = require('../connector.js');

exports.createAutocompleteActions = function () {
	Homey.manager('flow').on('action.get_connector.arg_name.get_connector', function( callback, args ){
		connector.getConnector( "metainfo", "", function( err, response ){
			if (err) Homey.log(err); return callback( 'No connectors found', null );

			var getConnectors = response['getConnectors'];
			getConnectors = getConnectors.filter( function( item ) { return ( item.id.toLowerCase().indexOf( args.query.toLowerCase() ) > -1 ) } );
			return callback( null, getConnectors );
		});

	});
}