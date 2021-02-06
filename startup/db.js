// mongoose.js configuration
const config = require('config');
const mongoose = require('mongoose');
const {dbDebug} = require('./debuggers');

module.exports = () => {
    // find the environment var info on RoboForm
    const username = config.get('db.username');
    const password = config.get('db.password');
    const dbname = config.get('db.name');
    const host = config.get('db.host');
    const connStr = config.get('db.connStr');
    // const connStr = 'mongodb+srv://marlonfsolis:MDBA-Hermana83@cluster0.en9sw.mongodb.net/jwtapidemo?retryWrites=true&w=majority';

    // https://mongoosejs.com/docs/deprecations.html
    // const connStr = `mongodb://${username}:${password}@${host}/${dbname}`;
    dbDebug('Connection String:', connStr);

    mongoose.connect(connStr, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then(() => {
            dbDebug('MongoDB connection completed.');
        })
        .catch((err) => {
            dbDebug('MongoDB connection error. Error:', err.message);
        });

    mongoose.connection.on('error', () => {
        dbDebug('Error connecting to the database.');
    });

    mongoose.connection.once('open', () => {
        dbDebug('Connection open.');
    });
};
