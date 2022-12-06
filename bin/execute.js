const Command = require('./command');

const installer = new Command('Start Application');
//installer.onComplete(() => require('./prepare'));
installer.start('npm', ['start']);
