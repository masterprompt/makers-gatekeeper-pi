const HexCommands = require('../constants/hex-commands');
const SoftSPI = require('rpi-softspi');
const rpio = require('rpio');

const Status = {
    OK: 'ok',
    ERROR: 'error'
}

class RaspberryPiRfidReader {
    spi;
    resetPin = 22;
    resetDelay= 50;
    rpio;

    constructor() {
        this.rpio = rpio;
        this.spi = new SoftSPI({
            clock: 23, // pin number of SCLK
            mosi: 19, // pin number of MOSI
            miso: 21, // pin number of MISO
            client: 24 // pin number of CS
        });
        this.spi.open();
        //  Send reset to reader
        this.rpio.open(this.resetPin, this.rpio.OUTPUT, this.rpio.LOW);
        setTimeout(() => this.rpio.write(this.resetPin, this.rpio.HIGH), this.resetDelay);
    }

    readKey () {
        //  Reset card
        this.reset();
        //  Find card

        const card = this.findCard();
        if (!card.status) {
          return;
        }

        const response = this.getUid();
        if (response.status === Status.OK) {
          const id = this.createUid(response.data);
          return id;
        }
    }

    createUid(data) {
      return [0,1,2,3]
        .map((index) => data[index].toString(16))
        .reduce((prev, cur) => `${prev}${cur}`,'');
    }

    writeRegister(address, value) {
        const data = [(address << 1) & 0x7e, value];
        const uint8Data = Uint8Array.from(data);
        this.spi.write(uint8Data);
    }

    readRegister(address) {
        const data = [((address << 1) & 0x7e) | 0x80, 0];
        const uint8Data = Uint8Array.from(data);
        const uint8DataResponse = this.spi.transfer(uint8Data);
        return uint8DataResponse[1];
      }

    reset() {
        this.writeRegister(HexCommands.CommandReg, HexCommands.PCD_RESETPHASE); // reset chip
        this.writeRegister(HexCommands.TModeReg, 0x8d); // TAuto=1; timer starts automatically at the end of the transmission in all communication modes at all speeds
        this.writeRegister(HexCommands.TPrescalerReg, 0x3e); // TPreScaler = TModeReg[3..0]:TPrescalerReg, ie 0x0A9 = 169 => f_timer=40kHz, ie a timer period of 25μs.
        this.writeRegister(HexCommands.TReloadRegL, 30); // Reload timer with 0x3E8 = 1000, ie 25ms before timeout.
        this.writeRegister(HexCommands.TReloadRegH, 0);
        this.writeRegister(HexCommands.TxAutoReg, 0x40); // Default 0x00. Force a 100 % ASK modulation independent of the ModGsPReg register setting
        this.writeRegister(HexCommands.ModeReg, 0x3d); // Default 0x3F. Set the preset value for the CRC coprocessor for the CalcCRC command to 0x6363 (ISO 14443-3 part 6.2.4)
        this.antennaOn(); // Enable the antenna driver pins TX1 and TX2 (they were disabled by the reset)
    }

    antennaOn() {
        let response = this.readRegister(HexCommands.TxControlReg);
        if (~(response & 0x03) != 0) {
          this.setRegisterBitMask(HexCommands.TxControlReg, 0x03);
        }
    }

    setRegisterBitMask(reg, mask) {
        let response = this.readRegister(reg);
        this.writeRegister(reg, response | mask);
    }

    clearRegisterBitMask(reg, mask) {
        let response = this.readRegister(reg);
        this.writeRegister(reg, response & ~mask);
    }

    findCard() {
        this.writeRegister(HexCommands.BitFramingReg, 0x07);
        const tagType = [HexCommands.PICC_REQIDL];
        let response = this.toCard(HexCommands.PCD_TRANSCEIVE, tagType);
        if (response.bitSize != 0x10) {
            response.status = Status.ERROR;
        }
        return { status: response.status, bitSize: response.bitSize };
    }

    getUid() {
      this.writeRegister(HexCommands.BitFramingReg, 0x00);
      const uid = [HexCommands.PICC_ANTICOLL, 0x20];
      let response = this.toCard(HexCommands.PCD_TRANSCEIVE, uid);
      if (response.status) {
        let uidCheck = 0;
        for (let i = 0; i < 4; i++) {
          uidCheck = uidCheck ^ response.data[i];
        }
        if (uidCheck != response.data[4]) {
          response.status = Status.ERROR;
        }
      }
      return { status: response.status, data: response.data };
  }

    toCard(command, bitsToSend) {
        let data = [];
        let bitSize = 0;
        let status = Status.ERROR;
        let irqEn = 0x00;
        let waitIRq = 0x00;
    
        if (command == HexCommands.PCD_AUTHENT) {
          irqEn = 0x12;
          waitIRq = 0x10;
        }
        if (command == HexCommands.PCD_TRANSCEIVE) {
          irqEn = 0x77;
          waitIRq = 0x30;
        }
        this.writeRegister(HexCommands.CommIEnReg, irqEn | 0x80); //Interrupt request is enabled
        this.clearRegisterBitMask(HexCommands.CommIrqReg, 0x80); //Clears all interrupt request bits
        this.setRegisterBitMask(HexCommands.FIFOLevelReg, 0x80); //FlushBuffer=1, FIFO initialization
        this.writeRegister(HexCommands.CommandReg, HexCommands.PCD_IDLE); // Stop calculating CRC for new content in the FIFO.
        //Write data to the FIFO
        for (let i = 0; i < bitsToSend.length; i++) {
          this.writeRegister(HexCommands.FIFODataReg, bitsToSend[i]);
        }
        //Excuting command
        this.writeRegister(HexCommands.CommandReg, command);
        if (command == HexCommands.PCD_TRANSCEIVE) {
          this.setRegisterBitMask(HexCommands.BitFramingReg, 0x80); //StartSend=1,transmission of data starts
        }
        //Wait for the received data to complete
        let i = 2000; //According to the clock frequency adjustment, operation M1 card maximum waiting time 25ms
        let n = 0;
        do {
          n = this.readRegister(HexCommands.CommIrqReg);
          i--;
        } while (i != 0 && !(n & 0x01) && !(n & waitIRq));
    
        this.clearRegisterBitMask(HexCommands.BitFramingReg, 0x80); //StartSend=0
        if (i != 0) {
          if ((this.readRegister(HexCommands.ErrorReg) & 0x1b) == 0x00) {
            //BufferOvfl Collerr CRCErr ProtecolErr
            status = Status.OK;
            if (n & irqEn & 0x01) {
              status = Status.ERROR;
            }
            if (command == HexCommands.PCD_TRANSCEIVE) {
              n = this.readRegister(HexCommands.FIFOLevelReg);
              let lastBits = this.readRegister(HexCommands.ControlReg) & 0x07;
              if (lastBits) {
                bitSize = (n - 1) * 8 + lastBits;
              } else {
                bitSize = n * 8;
              }
              if (n == 0) {
                n = 1;
              }
              if (n > 16) {
                n = 16;
              }
              //Reads the data received in the FIFO
              for (let i = 0; i < n; i++) {
                data.push(this.readRegister(HexCommands.FIFODataReg));
              }
            }
          } else {
            status = Status.ERROR;
          }
        }
        return { status: status, data: data, bitSize: bitSize };
    }


}

module.exports = RaspberryPiRfidReader;