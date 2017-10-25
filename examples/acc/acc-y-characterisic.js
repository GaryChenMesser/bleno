var util = require('util');
var bleno = require('../..');

const ADXL345 = require('adxl345-sensor');

const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

function AccYCharacteristic(){
	var acc;
	adxl345.getAcceleration(true)
		.then((acceleration, acc) => {
			acc = acceleration["y"];
		})
		.catch((err) => {
			console.log('err');
		});
	bleno.Characteristic.call(this, {
		uuid: '13333333333333333333333333330002',
		properties: ['read'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Gets acc y.'
			})
		]
	});
}

util.inherits(AccYCharacteristic, bleno.Characteristic);

AccYCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
	if (offset) {
		callback(this.RESULT_ATTR_NOT_LONG);
	}
	else if (data.length !== 2) {
		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
	}
	else {
		console.log('I love TingTing');
		var times = data.readUInt16BE(0);
		var self = this;
		if(self.updateValueCallback){
			self.updateValueCallback(acc);
		}
		callback(this.RESULT_SUCCESS);
	}
};

AccYCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if (offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	}
	else {
		var acc_y = new Buffer(2)
		adxl345.getAcceleration(true)
			.then((acceleration) => {
				acc_y = acceleration["y"];
			})
			.catch((err) => {
				console.log(`ADXL345 read error: ${err}`);
			});
		callback(this.RESULT_SUCCESS, data.writeUInt16BE(3, 0))
	}
};

module.exports = AccYCharacteristic;






















