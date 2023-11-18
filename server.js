const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const session = require('express-session');
const {v4: uuidv4} = require('uuid');
require('dotenv').config();
const LOCAL_STR = 'mongodb://localhost:27017/audiophile';


const db = mongoose.connect(LOCAL_STR);

const adminRouter = require("./routes/admin_router");
const userRouter = require('./routes/user_router')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname,'views/user_views'), path.join(__dirname,'views/admin_views')]);

app.use(express.static('public'))


app.use(session({
  secret: uuidv4(),
  resave: false,
  saveUninitialized: true
}));


app.use('/admin', adminRouter);
app.use('/', userRouter);


app.listen(PORT, async (req, res)=>{
  await db;
  try{
    db.then((con_obj)=>{
      console.log('db connected');
    });
    db.catch((err)=>{
      console.log('an error occured while connecting server');
    });
    console.log(`Server started at http://localhost:${PORT}/`)
  }catch(err){
    console.log(err)
  }
  
});

