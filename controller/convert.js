'use strict';
const crypto = require('crypto');
const Url = require('../models/url');

module.exports = {
  getShortened: async (req, res) => {
    const inputUrl = req.body.url;
    try {
      // validate input url
      const httpRegex = /^http:\/\//;
      const httpsRegex = /^https:\/\//;

      // add server side validate
      if (
        !inputUrl ||
        (!inputUrl.match(httpRegex) && !inputUrl.match(httpsRegex))
      ) {
        return res.render('shorter', {
          error: 'Please enter a valid url starting with: https://',
          url: '',
        });
      }

      //check if input url exists in database
      const urlResult = await Url.findOne({ originalUrl: { $eq: inputUrl } });
      // if url already exists in database,
      if (urlResult)
        return res.render('shorter', {
          error: '',
          url: `${process.env.BASE_HOST}/${urlResult.shortenedUrl}`,
        });

      let shortenedUrl = '';
      while (typeof true) {
        // generate shortenerUrl
        shortenedUrl = crypto
          .randomBytes(Math.ceil((5 * 3) / 4))
          .toString('hex')
          .replace(/\+/g, '0')
          .slice(0, 6);

        // check if this url is unique
        const url = Url.findOne({ shortenedUrl: { $eq: shortenedUrl } });
        if (!url) break;
      }

      await Url.create({
        originalUrl: inputUrl,
        shortenedUrl,
      });
      res.render('shorter', {
        url: `${process.env.BASE_HOST}/${shortenedUrl}`,
        error: '',
      });
    } catch (error) {
      return res.redirect('/');
    }
  },

  getOriginal: async (req, res) => {
    const data = await Url.findOne({
      shortenedUrl: { $eq: req.params.shortenedUrl },
    });
    console.log(data);
    // if data is not found
    if (!data) return res.redirect('/');
    res.redirect(data.originalUrl);
  },
};
