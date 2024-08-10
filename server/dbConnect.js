const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async()=>{
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Database Connected");
    }).catch((err)=>{
        console.log(err);
        console.log("Error connecting to database")
    })
}

module.exports = dbConnect;