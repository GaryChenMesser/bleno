var util = require('util');

var gpio = require('rpi-gpio');

//
// Require bleno peripheral library.
// https://github.com/sandeepmistry/bleno
//
var bleno = require('../..');
// for i2c adxl...............................................................
const ADXL345 = require('adxl345-sensor');

// The ADXL345 constructor options are optional.
//
// ADXL345.I2C_ADDRESS_ALT_GROUNDED() = 0x53
// ADXL345.I2C_ADDRESS_ALT_HIGH() = 0x1D
//
const options = {
  i2cBusNo   : 1, // defaults to 1
  i2cAddress : ADXL345.I2C_ADDRESS_ALT_GROUNDED() // defaults to 0x53
};

const adxl345 = new ADXL345(options);

// Read ADXL345 three-axis acceleration, repeat
//
const getAccelerationX = () => {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      console.log(`acceleration = ${JSON.stringify(acceleration["x"], null, 2)}`);
      //setTimeout(getAcceleration, 1000);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
      //setTimeout(getAcceleration, 2000);
    });
};
const getAccelerationY = () => {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      console.log(`acceleration = ${JSON.stringify(acceleration["y"], null, 2)}`);
      //setTimeout(getAcceleration, 1000);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
      //setTimeout(getAcceleration, 2000);
    });
};
const getAccelerationZ = () => {
  adxl345.getAcceleration(true) // true for g-force units, else false for m/s²
    .then((acceleration) => {
      console.log(`acceleration = ${JSON.stringify(acceleration["z"], null, 2)}`);
      //setTimeout(getAcceleration, 1000);
    })
    .catch((err) => {
      console.log(`ADXL345 read error: ${err}`);
      //setTimeout(getAcceleration, 2000);
    });
};

// Initialize and configure the ADXL345 accelerometer
//
adxl345.init()
  .then(() => adxl345.setMeasurementRange(ADXL345.RANGE_2_G()))
  .then(() => adxl345.setDataRate(ADXL345.DATARATE_100_HZ()))
  .then(() => adxl345.setOffsetX(0)) // measure for your particular device
  .then(() => adxl345.setOffsetY(0)) // measure for your particular device
  .then(() => adxl345.setOffsetZ(0)) // measure for your particular device
  .then(() => adxl345.getMeasurementRange())
  .then((range) => {
    console.log(`Measurement range: ${ADXL345.stringifyMeasurementRange(range)}`);
    return adxl345.getDataRate();
  })
  .then((rate) => {
    console.log(`Data rate: ${ADXL345.stringifyDataRate(rate)}`);
    return adxl345.getOffsets();
  })
  .then((offsets) => {
    console.log(`Offsets: ${JSON.stringify(offsets, null, 2)}`);
    console.log('ADXL345 initialization succeeded');
    getAcceleration();
  })
.catch((err) => console.error(`ADXL345 initialization failed: ${err} `));

//...............................................................................
//
// Pizza
// * has crust
// * has toppings
// * can be baked
//
var pizza = require('./pizza');

//
// The BLE Pizza Service!
//
var PizzaService = require('./pizza-service');

//
// A name to advertise our Pizza Service.
//
var name = 'PizzaSquat';
var pizzaService = new PizzaService(new pizza.Pizza());

gpio.on('change', function(channel, value) {
  console.log('Channel ' + channel + ' value is now ' + value);
  pizza.button = value;
});
gpio.setup(7, gpio.DIR_IN, gpio.EDGE_BOTH);

//
// Wait until the BLE radio powers on before attempting to advertise.
// If you don't have a BLE radio, then it will never power on!
//
bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // We will also advertise the service ID in the advertising packet,
    // so it's easier to find.
    //
    bleno.startAdvertising(name, [pizzaService.uuid], function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
  else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(err) {
  if (!err) {
    console.log('advertising...');
    //
    // Once we are advertising, it's time to set up our services,
    // along with our characteristics.
    //
    bleno.setServices([
      pizzaService
    ]);
  }
});
