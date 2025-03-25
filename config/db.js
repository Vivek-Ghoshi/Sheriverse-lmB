const mongoose = require('mongoose');
require('dotenv').config();
const mongouri = process.env.MONGO_URI;

mongoose.connect(mongouri)
.then(function(){
    console.log("Connected to mongoose");
})
.catch(function(error){
    console.log(error.message);
})

const db = mongoose.connection;

module.exports = db;