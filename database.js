const mongoose = require('mongoose');


const database=()=>
    mongoose.connect(process.env.MONGO_URI)
.then(data => console.log(`Database Connected to MongoDB`))
.catch(err => console.log(`Database is not connect to the mongodb`))


module.exports = database;



