require('dotenv').config();
const express = require('express');
const port = 8000;
const connectDB = require('./db/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const passportLocal = require('./middleware/passportLocalStrategy');
const passportGoogle = require('./middleware/passportGoogleOauthStrategy');
const nodemailer = require('nodemailer');

const app = express();

app.use(cookieParser())
app.use(express.urlencoded({extended:false}));
app.use(express.static('./public'));



// setting view engine
app.set('view engine', 'ejs');


app.use(session({
  name:'authentication',
  secret:process.env.SESSION_SECRET,
  saveUninitialized:false,
  resave:false,
  cookie:{
      maxAge:(2000 * 60 * 100)
  },
  store:MongoStore.create({
      mongoUrl:'mongodb://127.0.0.1:27017/UserAuthentication',
      autoRemove:'disabled'
  })
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);







app.use('/', require('./routes'));


const start = async() => {
  try{
 await connectDB(process.env.MONGO_URI);
 app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
 })
} catch(err) {
  console.log(err);
  return;
}
}

start();