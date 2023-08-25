require('dotenv').config();
const express = require('express');
const port = 8000;
const db = require('./db/mongoose');
const path = require('path');

const app = express();

//middleware
app.use(express.json());
app.use(express.static('./public'));

// setting view engine
app.set('view engine', 'ejs');
app.set('ejs', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  return res.send('Hello Moon');
})

app.use('/', require('./routes'));


app.listen(port, ()=> {
  console.log(`Server is running on port:${port}`);
})