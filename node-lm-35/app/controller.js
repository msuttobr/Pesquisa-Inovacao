const express = require('express');
const { ArduinoDataTemp } = require('./newserial');
const { ArduinoDataTemp2 } = require('./newserial');
const router = express.Router();


router.get('/', (request, response, next) => {
    let sum = ArduinoDataTemp.List.reduce((a, b) => a + b, 0);
    let average = (sum / ArduinoDataTemp.List.length).toFixed(2);

    let sum2 = ArduinoDataTemp2.List2.reduce((a, b) => a + b, 0);
    let average2 = (sum2 / ArduinoDataTemp2.List2.length).toFixed(2);

    response.json({
        data: ArduinoDataTemp.List,
        total: ArduinoDataTemp.List.length,
        average: isNaN(average) ? 0 : average,
        
        data2: ArduinoDataTemp2.List2,
        total2: ArduinoDataTemp2.List2.length,
        average2: isNaN(average2) ? 0 : average2,
    });

});

module.exports = router;