var util = require('util');
var bleno = require('../..');

var AccXCharacteristic = require('./acc-x-characterisic');
var AccYCharacteristic = require('./acc-y-characterisic');
var AccZCharacteristic = require('./acc-z-characterisic');

function AccService() {
	bleno.PrimaryService.call(this, {
		uuid: '13333333333333333333333333333337',
		characteristics: [
			new AccXCharacteristic(),
		//	new AccYCharacteristic(),
		//	new AccZCharacteristic()
		]
	});
}

util.inherits(AccService, bleno.PrimaryService);

module.exports = AccService;
