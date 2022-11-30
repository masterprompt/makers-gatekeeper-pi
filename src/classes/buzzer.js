const rpio = require('rpio');

let BUZZERCount = 1;
let isCycleEnded = true;

class Buzzer {
    
    pin = 18;

    constructor () {
        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, rpio.LOW);
    }


    beep() {
        if (this.buzzer_pin) {
          setTimeout(() => {

            rpio.write(this.buzzer_pin, 1);

            setTimeout(() => {
              rpio.write(this.buzzer_pin, 0);

              BUZZERCount++;
              if (BUZZERCount == 3) {
                BUZZERCount = 1;
                isCycleEnded = true;
              } else {
                isCycleEnded = false;
                this.alert();
              }

            }, 80);


          }, 180);
        }
      }
}

module.exports = Buzzer;