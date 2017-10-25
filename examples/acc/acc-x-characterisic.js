var util = require('util');
var bleno = require('../..');

const ADXL345 = require('adxl345-sensor');

const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

var acc;

function getValue(value){
	acc = value;
}

function AccXCharacteristic(){
	var acc; // = new Buffer(1);
	adxl345.getAcceleration(true)
		.then((acceleration, acc) => {
			acc = acceleration["x"];
			//acc.writeDoubleBE(accelaration["x"], 0);
			//console.log(acceleration["x"]);
			//console.log(acc);
		})
		.catch((err) => {
			console.log('err');
		});
	//console.log(acc);
	bleno.Characteristic.call(this, {
		uuid: '13333333333333333333333333330001',
		properties: ['read'],
		descriptors: [
			new bleno.Descriptor({
				uuid: '2901',
				value: 'Gets acc x.'
			})
		]
	});
}

util.inherits(AccXCharacteristic, bleno.Characteristic);

AccXCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
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

AccXCharacteristic.prototype.onReadRequest = function(offset, callback) {
	if (offset) {
		callback(this.RESULT_ATTR_NOT_LONG, null);
	}
	else {
		var acc_x = new Buffer(2)
		adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
			.then((acceleration) => {
				acc_x = acceleration["x"];
			})
			.catch((err) => {
				console.log(`ADXL345 read error: ${err}`);
				//setTimeout(getAcceleration, 2000);
			});
		callback(this.RESULT_SUCCESS, data.writeUInt16BE(3, 0))
		//var data = new Buffer(2);
		//data.writeUInt16BE(this.pizza.toppings, 0);
		//callback(this.RESULT_SUCCESS, data);
	}
};

module.exports = AccXCharacteristic;






















