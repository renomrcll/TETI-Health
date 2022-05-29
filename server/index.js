const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoutes = require('./routes/Users');

const app = express();
const PORT = process.env.PORT || 5000;
let server;

//middleware config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use('/api/users/', userRoutes);


mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=>{
    console.log('Connected to MongoDB');
})
.catch(err=>{
    console.log(err);
});

server = app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
});
