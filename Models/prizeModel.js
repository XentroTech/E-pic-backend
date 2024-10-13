const mongoose =require('mongoose')
const Schema = mongoose.Schema;


const prizeSchema = new Schema({
    image_url:{
        type: String,
        riquired:ture,
    },
    title:{
        type: String,
        required: true
    }
})


module.exports = mongoose.Model('Prize', prizeSchema);