var util = require('util');
var bleno = require('../..');

const ADXL345 = require('adxl345-sensor');

const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

function AccZCharacteristic(){
	var acc;
	adxl345.getAcceleration(true)
		.then((acceleration, acc) => {
			acc = acceleration["z"];
		})
		.catch((err) => {
			console.log('err');
		});
	bleno.Characteristic.call(this, {
		uuid: '13333333333333333333333333330003',
		properties: ['read'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Gets acc z.'
			})
		]
	});
}

util.inherits(AccZCharacteristic, bleno.Characteristic);

AccZCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
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

AccZCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if (offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	}
	else {
		var acc_z = new Buffer(2)
		adxl345.getAcceleration(true)
			.then((acceleration) => {
				acc_z = acceleration["z"];
			})
			.catch((err) => {
				console.log(`ADXL345 read error: ${err}`);
			});
		callback(this.RESULT_SUCCESS, data.writeUInt16BE(3, 0))
	}
};

module.exports = AccZCharacteristic;





















var util = require('util');
var bleno = require('../..');

const ADXL345 = require('adxl345-sensor');

const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

function AccZCharacteristic(){
	bleno.Characteristic.call(this, {
		uuid: '13333333333333333333333333330003',
		properties: ['read'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Gets acc z.'
			})
		]
	});
}

util.inherits(AccZCharacteristic, bleno.Characteristic);

//AccXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
//	if (offset) {
//		callback(this.RESULT_ATTR_NOT_LONG);
//	}
//	else if (data.length !== 2) {
//		callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
//	}
//	else {
//		this.pizza.toppings = data.readUInt16BE(0);
//		callback(this.RESULT_SUCCESS);
//	}
//};

AccZCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if (offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	}
	else {
		var acc_z = new Buffer(2)
		adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
			.then((acceleration) => {
				acc_z = acceleration["z"];
			})
			.catch((err) => {
				console.log(`ADXL345 read error: ${err}`);
				//setTimeout(getAcceleration, 2000);
			});
		callback(this.RESULT_SUCCESS, data.writeUInt16BE(5, 0))
		//var data = new Buffer(2);
		//data.writeUInt16BE(this.pizza.toppings, 0);
		//callback(this.RESULT_SUCCESS, data);
	}
};

module.exports = AccZCharacteristic;






















