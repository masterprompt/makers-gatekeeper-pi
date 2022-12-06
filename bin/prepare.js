const Command = require('./command');

const installer = new Command('Install Dependencies');
installer.onComplete(() => require('./execute'));
installer.start('npm', ['install']);
