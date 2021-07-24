const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const cors = require('cors');
const morgan = require('morgan')
const mongoose = require('mongoose');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '100mb'}));
app.use(morgan("common"));
app.use('/static', express.static('public'));

// routes
const users = require('./routes/user/user.route');;

app.use('/users', users);

// mongoose connect
mongoose.connect('mongodb://localhost/teams-app', { useNewUrlParser: true, useUnifiedTopology: true });
const connect = mongoose.connection;
connect.on('error', function(){
  console.log('Mongodb connect to fail !');
});
connect.on('open', function(){
  console.log('Mongodb connected...');
});


// server listening
app.listen(PORT, () => {
  console.log('Server is running on ' + PORT);
})