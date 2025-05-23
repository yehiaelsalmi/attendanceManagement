const mongoose = require('mongoose');


const initConnection = () => {
    let now = new Date();
    return mongoose.connect(process.env.CONNECTION_STRING_ONLINE)
        .then(() => console.log('connected to DB successfully '))
        .catch((err) => console.log('error: '+ err));
}

module.exports = initConnection;
