const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth',require('./routes/authroutes'));
app.use('/api/admin',require('./routes/adminroutes'));
app.use('/api/employee',require('./routes/employeeroutes'));

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT,()=>{
            console.log(`Server running on port ${process.env.PORT}`);
        });
    });