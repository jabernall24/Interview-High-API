
const { Client } = require('pg');

const client = new Client(process.env.URL);

client.connect(err => {
    if (err) {
      console.error('connection error', err.stack);
    } else {
      console.log('connected');
    }
})

module.exports = client;