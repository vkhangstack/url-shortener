'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./database/db');
const { getShortened, getOriginal } = require('./controller/convert');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  res.render('shorter', { error: '', url: '' });
});

app.post('/convert', getShortened);
app.get('/:shortenedUrl', getOriginal);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App running port ${PORT}`);
});
