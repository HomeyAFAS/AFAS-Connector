"use strict";

const autoCompleteActions = require('./lib/autocomplete/actions.js');
// var autoCompleteConditions = require('./lib/autocomplete/conditions.js');
// var autoCompletetriggers = require('./lib/autocomplete/triggers.js');

const flowActions = require('./lib/flow/actions.js');
// var flowConditions = require('./lib/flow/conditions.js');
// var flowTriggers = require('./lib/flow/triggers.js');

var Animation = Homey.manager('ledring').Animation;

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

//-------------------White Sleep Animation Start ---------------------------------------------------
var frames_christmas = [];
var frame_christmas = [];

// for every pixel...
for( var pixel = 0; pixel < 24; pixel++ ) {
	if( pixel%6 >= 3 ) {
		frame_christmas.push({
			r: 100,	g: 0,	b: 0
		});
	} else {
		frame_christmas.push({
			r: 0, g: 100, b: 0
		})
	}
}
frames_christmas.push(frame_christmas);

var animation_christmas = new Animation({
	
    options: {
        fps     : 60, 	// real frames per second
        tfps    : 60, 	// target frames per second. this means that every frame will be interpolated 60 times
        rpm     : 48,	// rotations per minute
    },
    frames    : frames_christmas
})

animation_christmas.register(function(err, result){
	Homey.manager('ledring').registerScreensaver('christmas', animation_christmas)
	if( err ) return Homey.error(err);
	animation_christmas.on('screensaver_start', function( screensaver_id ){
		Homey.log('Screensaver started')
	})
	animation_christmas.on('screensaver_stop', function( screensaver_id ){
		Homey.log('Screensaver stopped')
	})
})
//-------------------White Sleep Animation Stop ---------------------------------------------------

//------------------- newyear Animation Start ---------------------------------------------------
var frames_newyear = [];
var frame_newyear = [];
var randomNumbers = [];

// for every pixel...
for (var pixel = 0; pixel < 24; pixel++) {
    for (var i = 0; i < 8; i++) {
        randomNumbers[i] = randomPixel(0,23);
    }
	if (isInArray(pixel, randomNumbers)) {
		frame_newyear.push({
			r: Math.floor((Math.random() * 255) + 1), g: Math.floor((Math.random() * 255) + 1),	b: Math.floor((Math.random() * 255) + 1)
		});
    } else {
		frame_newyear.push({
			r: 0, g: 0, b: 0
		})
	}
}

function randomPixel (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}
function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

frames_newyear.push(frame_newyear);

var animation_newyear = new Animation({
    options: {
        fps     : 60, 	// real frames per second
        tfps    : 60, 	// target frames per second. this means that every frame will be interpolated 60 times
        rpm     : 48,	// rotations per minute
    },
    frames    : frames_newyear
})

animation_newyear.register(function(err, result){
	Homey.manager('ledring').registerScreensaver('newyear', animation_newyear)
	if( err ) return Homey.error(err);
	animation_newyear.on('screensaver_start', function( screensaver_id ){
		Homey.log('Screensaver started')
	})
	animation_newyear.on('screensaver_stop', function( screensaver_id ){
		Homey.log('Screensaver stopped')
	})
})
//------------------- Rain Animation Stop ---------------------------------------------------