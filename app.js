const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use('/', router);

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use(errorHandler);

app.listen(PORT, () => {
});
