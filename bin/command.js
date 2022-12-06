const { spawn } = require('child_process');

class Command {
    onCompleteCallbacks = [];
    name;
    process;

    constructor (name = '') {
        this.name = name;
    }

    start (...args) {
        console.log(`${this.name} starting...`);
        this.process = spawn(...args);

        this.process.stdout.on("data", data => console.log(`${data}`));

        this.process.stderr.on("data", data => console.log(`${data}`));
        
        this.process.on('error', (error) => console.error(`${error.message}`, error));
        
        this.process.on("close", code => {
            console.log(`${this.name} completed with code ${code}`);
            if (!code) {
                this.onCompleteCallbacks.forEach(callback => callback());
            }            
        });
    }

    onComplete (handler = () => {}) {
        this.onCompleteCallbacks.push(handler);
    }
}

module.exports = Command;