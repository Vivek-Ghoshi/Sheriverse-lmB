const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const app = express();
const path = require("path");
require('dotenv').config();

const commanRoutes = require('./routes/comman-routes');
const adminRoutes = require('./routes/admin-routes');
const instructorRoutes = require('./routes/instructor-routes');
const studentRoutes = require('./routes/student-routes');
// const aiRoutes = require('./routes/ai-routes');

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));
app.use(cookieParser()); 
app.use('/api',commanRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/instructor',instructorRoutes);
app.use('/api/student',studentRoutes);
// app.use('/api/ai',aiRoutes); // not working currently soon i will add this functionality too

const port = process.env.PORT || 4000;
app.listen(port);
