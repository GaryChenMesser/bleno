var util = require('util');
var bleno = require('../..');
var pizza = require('./pizza');

function PizzaButtonCharacteristic(pizza) {
  bleno.Characteristic.call(this, {
    uuid: '13333333333333333333333333330004',
    properties: ['read', 'write'],
    descriptors: [
      new bleno.Descriptor({
        uuid: '2901',
        value: 'Gets or sets the button value.'
      })
    ]
  });

  this.pizza = pizza;
}

util.inherits(PizzaButtonCharacteristic, bleno.Characteristic);

PizzaButtonCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG);
  }
  else if (data.length !== 1) {
    callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
  }
  else {
    var but = data.readUInt8(0);
    this.pizza.button = but;
    callback(this.RESULT_SUCCESS);
  }
};

PizzaCrustCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if (offset) {
    callback(this.RESULT_ATTR_NOT_LONG, null);
  }
  else {
    var data = new Buffer(1);
    data.writeUInt8(this.pizza.button, 0);
    callback(this.RESULT_SUCCESS, data);
  }
};

module.exports = PizzaButtonCharacteristic;
