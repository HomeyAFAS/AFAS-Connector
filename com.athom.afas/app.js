"use strict";

const autoCompleteActions = require('./lib/autocomplete/actions.js');
// var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
// var autoCompletetriggers = require('./lib/autocomplete/triggers.js');

const flowActions = require('./lib/flow/actions.js');
// var flowConditions = require('./lib/flow/conditions.js');
// var flowTriggers = require('./lib/flow/triggers.js');

module.exports = {
	init: function () {
		autoCompleteActions.createAutocompleteActions();
		// autoCompleteConditions.createAutocompleteConditions();
		// autoCompletetriggers.createAutocompleteTriggers();

		flowActions.createActions();
		// flowConditions.createConditions();
		// flowTriggers.createTriggers();
	}
};