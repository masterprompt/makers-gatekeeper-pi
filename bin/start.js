const Command = require('./command');

const puller = new Command('Pull Repo');
//  We want the new stuff to run once it's pulled in
puller.onComplete(() => require('./prepare'));

puller.start('git', ['pull']);