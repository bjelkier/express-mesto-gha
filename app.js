const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use('/', auth, router);

app.listen(PORT, () => {
});
