require('dotenv').config()
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./router/index.js')
const errorMiddleware = require('./middlewares/error-middleware.js')
const mime = require('mime');

const PORT = process.env.PORT || 5000;
const app = express()

const publicPath = path.join(__dirname, './../client/public');
app.use(express.static(publicPath));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

app.use('/api', router);
app.use(errorMiddleware);

app.use(express.static('public', {
    setHeaders: (res, path) => {
      if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
      }
      if (path.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
      }
    },
    extensions: ['html', 'js', 'mjs']
  }));

const start = async() => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()