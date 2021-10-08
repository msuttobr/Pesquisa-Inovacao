const sensors = require('./sensors')
const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;

class ArduinoRead {

    constructor() {
        this.listData = [];
        this.listData2 = [];

        this.listDataHour = [];
        this.listDataHour2 = [];
        
        this.__listDataTemp = [];
    }

    get List() {
        return this.listData;
    }
    get List2() {
        return this.listData2;
    }

    fake_data() {
        setInterval(() => {
            let data_float = sensors.lm35(-2, 3);
            let data_float2 = sensors.ldr();

            if (this.listData.length === 59) {
                let sum = this.listData.reduce((a, b) => a + b, 0);
                this.listDataHour.push((sum / this.listData.length).toFixed(2));
                while (this.listData.length > 0) {
                    this.listData.pop();
                } 
            }
            if (this.listData2.length === 59) {
                let sum2 = this.listData2.reduce((a, b) => a + b, 0);
                this.listDataHour2.push((sum2 / this.listData2.length).toFixed(2));
                while (this.listData2.length > 0) {
                    this.listData2.pop();
                } 
            }
            console.log('Data', data_float);
            console.log('Data2', data_float2);

            this.listData.push(data_float);
            this.listData2.push(data_float2);
        }, 2000);
    }


    SetConnection() {
        SerialPort.list().then(listSerialDevices => {

            let listArduinoSerial = listSerialDevices.filter(serialDevice => {
                return serialDevice.vendorId == 2341 && serialDevice.productId == 43;
            });

            if (listArduinoSerial.length != 1) {
                this.fake_data();
                console.log("Arduino not found - Generating data");
            } else {
                console.log("Arduino found in the com %s", listArduinoSerial[0].comName);
                return listArduinoSerial[0].comName;
            }
        }).then(comName => {
            try {
                let arduino = new SerialPort(comName, { baudRate: 9600 });

                const parser = new Readline();
                arduino.pipe(parser);
                arduino.on('close',() => {
                    console.log('Lost Connection');
                    this.fake_data();
                });
                parser.on('data', (data) => {
                    console.log('data', data);
                    this.listData.push(parseFloat(data));
                });
            } catch (e) {
                this.fake_data();
            }

        }).catch(error => console.log(error));
    }
}

const serial = new ArduinoRead();
serial.SetConnection();

module.exports.ArduinoDataTemp = { List: serial.List}
module.exports.ArduinoDataTemp2 = { List2: serial.List2}