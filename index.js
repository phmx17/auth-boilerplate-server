const express = require ('express');
const router = require('./router');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');   // prevent cors errors
//DB setup
mongoose.connect('mongodb+srv://SY:boner@cluster0-nxshw.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,  // prevent depracation warnings
    useUnifiedTopology: true,
    useCreateIndex: true
});
// require('./dbsetup');

// App setup
app.use(morgan('combined'));
app.use(cors());  // that simple; API will allow POST requests from outside domains; can also restrict to certain domanins

app.use(express.json());
router(app);




const PORT = process.env.PORT || 5000

app.listen (PORT, ()=> {
    console.log('listening on port: ', PORT)
})