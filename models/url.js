'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortenedUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Url', urlSchema);
