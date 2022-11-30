const config = require('config');
const App = require('./classes/app');

const app = App.createApp();

app.start();
