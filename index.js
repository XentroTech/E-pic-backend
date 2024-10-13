const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const database = require('./database');
const user = require('./Routes/userRoutes')
const otp = require('./Routes/otpRoutes')
const imageRoutes = require('./Routes/imageRoutes')
const errorMiddleware = require('./utils/error')

//for performance
// const compression = require('compression')
// app.use(compression())

// intialize app
const app = express();
const PORT = 3000;
dotenv.config();
app.use(express.json())

// middlewares
app.use(cors());
app.use(bodyParser.json());

// database
database();


// routes
app.get("/", (req,res)=>{res.send("welcome to epic")})
app.use("/api/v1/", user);
app.use("/api/v1/", otp);
app.use("/api/v1/", imageRoutes)




// error middleware
app.use(errorMiddleware)

//listning port
app.listen(PORT, ()=>{
    console.log(`listening from port: ${PORT}`)
})